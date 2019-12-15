const jwt = require('jsonwebtoken');



module.exports = (req,res,next)=>{
    let decodedToken;
    try{
       const token = req.get("Authorization").split(" ")[1];
       decodedToken =  jwt.verify(token,process.env.JWT_KEY);
       if(!decodedToken){
           throw new Error();
       }
       req.userId = decodedToken.userId;
        next();
    }catch(error){

        res.status(401).json({message:'Your Session has expired. Please Login again.'})
    }
}