export const signup = async(req,res) =>{
    try{
        const {fullName, username, password, confirmPassword, gender} = req.body;
    }
    catch(error){
        
    }
};
export const login = (req,res) =>{
    res.send("login user");
}
export const logout = (req,res) =>{
    res.send("logout user");
}