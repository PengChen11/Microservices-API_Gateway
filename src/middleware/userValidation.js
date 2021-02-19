'use strict';

// This middleware is used to make sure that user can only request their own info

module.exports = async (req, res, next)=>{

  const userValidationErr = {message_spec: 'Access Denied', statusCode:403, statusMessage:'Authorization Error'};

  
  if (req.user.role==='admin'){
    //Admin can do all kinds of modification, but got to make sure the user DO exist first. Auth service will check whether the user exsit or not. So the gateway pass all admin requests anyway.
   
    next();
    return;
  }

  // PATCH operatioin for all non admin users. Gotta to make sure the requesting user is modifing their own info.
  if (req.method==='PATCH' && req.body.username){
    const reqestingUser = req.user.username;
    const targetUser = req.body.username;

    if (reqestingUser != targetUser) {
      next(userValidationErr);
      return;
    }
  }

  // GET and DELETE operation will require the requesting user's info to match the DB search result. Thus it will be handled at AUTH service level.
  next();
};
