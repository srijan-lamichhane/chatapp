import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    try{
        //get the token
        const token = req.cookies.jwt;  //we need to use the cookie-parser middleware to parse cookies from the incoming requests. (in serverjs)
        //verify the token
        if(!token){
            return res.status(401).json({error: "Unauthorized No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error: "Unauthorized Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({error: "User not found"});
        }
        req.user = user;
        next(); // to move to the next middleware i.e sendMessage controller
    }
    catch(error){
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export default protectRoute;