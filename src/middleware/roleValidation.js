'use strict';
// This middleware is used to make sure when regular sign up new account, they can NOT register themselves as ADMIN

module.exports = (req, res, next)=>{
  const roleErr = {message_spec: 'Access Denied. Invalid User Role.', statusCode:403, statusMessage:'Authorization Error'};
  if (req.body.role && req.body.role != 'user'){
    next(roleErr);
    return;
  }
  next();
};
