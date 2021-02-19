'use strict';
// This middleware is used to secure the routes that require ADMIN Authorization

module.exports = (req, res, next)=>{
  const adminErr = {message_spec: 'Admin authorization required', statusCode:401, statusMessage:'Authorization error'};
  if (req.user.role != 'admin'){
    next(adminErr);
    return;
  }
  next();
};

