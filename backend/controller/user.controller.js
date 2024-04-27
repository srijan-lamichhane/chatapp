import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUser = req.user._id;

        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("-password");
        //In MongoDB queries, $ne is a comparison operator that stands for "not equal".
        res.status(200).json({users: filteredUsers});
    }
    catch(error){
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}