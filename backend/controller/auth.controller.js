import User from "../models/user.model.js";

export const signup = async (req,res) =>{
    try{
        console.log("Request Body:", req.body);
        const {fullName, username, password, confirmPassword, gender} = req.body;
        // to check if the password match
        if(password !== confirmPassword){
            return res.status(400).json({message: "passwords do not match"});
        }
        // to check if user already exists
        const user = await User.findOne({username})
        if(user){
            return res.status(400).json({message: "user already exists"});
        }
        // to hash the password

        //avatar: avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // to create a new user
        const newUser = new User({
            fullName, 
            username,
            password,
            gender,
            profilePic: gender === "male"? boyProfilePic : girlProfilePic
        });
        await newUser.save(); // to save the user to the database
        
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });                 

    }
    catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal server error"})
    }
};
export const login = (req,res) =>{
    res.send("login user");
}
export const logout = (req,res) =>{
    res.send("logout user");
}