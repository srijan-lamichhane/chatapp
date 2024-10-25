import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndCookie from "../utils/generateToken.js";

import { BloomFilter } from "bloom-filters";
import { redis } from "../db/connectDB.js";

// Initialize Bloom Filter
const bloomFilter = new BloomFilter(32 * 1024 * 1024, 7); // 32MB size with 7 hash functions

// Load existing usernames into Bloom Filter on startup
const loadUsernamesIntoBloom = async () => {
  try {
    const usernames = await User.find({}, "username");
    usernames.forEach((user) => bloomFilter.add(user.username));
    console.log("Bloom filter initialized with existing usernames");
  } catch (error) {
    console.error("Error loading usernames into Bloom filter:", error);
  }
};
loadUsernamesIntoBloom();

// Redis key generators
const getUserKey = (username) => `user:${username}`;
const getCredentialsKey = (username) => `credentials:${username}`;

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "passwords do not match" });
    }

    // Check Bloom Filter first
    if (bloomFilter.has(username)) {
      // Double-check in Redis and then in Database
      const existingUser = await redis.get(getUserKey(username));
      if (existingUser) {
        return res.status(400).json({ message: "user already exists" });
      }

      const dbUser = await User.findOne({ username });
      if (dbUser) {
        return res.status(400).json({ message: "user already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndCookie(newUser._id, res);
      await newUser.save();

      // Add to Bloom Filter
      bloomFilter.add(username);

      // Cache user data in Redis
      const userData = {
        _id: newUser._id.toString(),
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      };

      // Store user data and credentials in Redis with 30-day expiry
      const THIRTY_DAYS = 30 * 24 * 60 * 60; // in seconds
      await redis.setex(
        getUserKey(username),
        THIRTY_DAYS,
        JSON.stringify(userData)
      );
      await redis.setex(
        getCredentialsKey(username),
        THIRTY_DAYS,
        JSON.stringify({ password: hashedPassword })
      );

      res.status(201).json(userData);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check Bloom Filter first
    if (!bloomFilter.has(username)) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check Redis cache first
    const cachedUser = await redis.get(getUserKey(username));
    const cachedCredentials = await redis.get(getCredentialsKey(username));

    let user, hashedPassword;

    if (cachedUser && cachedCredentials) {
      // Use cached data
      user = JSON.parse(cachedUser);
      hashedPassword = JSON.parse(cachedCredentials).password;
    } else {
      // Fetch from database
      user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }
      hashedPassword = user.password;

      // Cache the data for future use
      const THIRTY_DAYS = 30 * 24 * 60 * 60;
      await redis.setex(
        getUserKey(username),
        THIRTY_DAYS,
        JSON.stringify({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          profilePic: user.profilePic,
        })
      );
      await redis.setex(
        getCredentialsKey(username),
        THIRTY_DAYS,
        JSON.stringify({ password: hashedPassword })
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    console.log("User authenticated, generating token");
    generateTokenAndCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { username } = req.body;

    // Clear Redis cache on logout
    if (username) {
      await redis.del(getUserKey(username));
      await redis.del(getCredentialsKey(username));
    }

    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
