const jwt = require('jsonwebtoken');

const authenticate=(request,response,next)=>{
    // get token from header
    const token= request.header('x-auth-token');
    if (!token){
        return response.status(401).json({ msg: 'NO Token, Authorization denied'});
    }
    // verify the token
    let decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    request.user=decoded.user;
    next();
};

module.exports=authenticate;