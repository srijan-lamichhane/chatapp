import jwt from 'jsonwebtoken';

const generateTokenAndCookie = (userId, res) => {
    const token = jwt.sign({userId},
        process.env.JWT_SECRET,{    //Synchronously sign the given payload into a JSON Web Token string payload.
            expiresIn: "15d"
        });
        //we created token now set it as a cookie.
        res.cookie("jwt", token, {
            maxAge: 15*24*60*60*1000, //15 days in microseconds -> cz can't be set in string.
            httpOnly: true, // to prevent XSS attacks (cross-site scripting attacks) -> since user cannot access cookie via js but onlyt thourgh http requests.
            sameSite: "strict", // to prevent CSRF attacks (cross-site request forgery attacks) -> since cookie can only be sent to the same site.
            secure: process.env.NODE_ENV !== "development" // to ensure that cookie is only sent over HTTPS in production mode.
        });
}
//call above fxn in auth.controller.js
export default generateTokenAndCookie;