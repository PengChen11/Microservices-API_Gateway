'use strict';
// This middleware is used to secure the routes that only open for microservices to consume.

module.exports = (req, res, next)=>{
  const accessErr = {message_spec: 'This route is only for microservices to consume', statusCode:401, statusMessage:'Authorization error'};
  if (req.user.role != 'service'){
    next(accessErr);
    return;
  }
  next();
};