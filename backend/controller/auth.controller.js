import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        // to check if the password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "passwords do not match" });
        }
        // to check if user already exists
        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({ message: "user already exists" });
        }
        // to hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //avatar: avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // to create a new user
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        if (newUser) {
            // Generate jwt token here
            generateTokenAndCookie(newUser._id, res);

            await newUser.save(); // to save the user to the database

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }

    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid usernname or password" });
        }
        // I was getting error of unauthorized token since this below section was under else and the token is not generated while logging in.
        console.log("User authenticated, generating token");
        generateTokenAndCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });


    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}