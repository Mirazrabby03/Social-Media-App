const jwt = require("jsonwebtoken");

const requireSignin = (req, res, next) =>{
    
    if(req.headers.authorization){
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(JSON.stringify(user));
    req.user = user;
    
    }
    else{
    return res.status(400).json({message:"Authorization required"});
    }
    next();
    
};

module.exports = requireSignin;