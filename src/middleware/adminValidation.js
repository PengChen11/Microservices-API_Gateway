'use strict';

module.exports = (req, res, next)=>{
  const adminErr = {message_spec: 'Admin authorization required', statusCode:401, statusMessage:'Authorization error'};
  if (req.user.role != 'admin'){
    next(adminErr);
    return;
  }
  next();
};

