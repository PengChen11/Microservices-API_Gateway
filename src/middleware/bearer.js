'use strict';

module.exports = async (req, res, next) => {

  let invalidErr = {message_spec: 'Login failed. Please try to login again.', statusCode: 401, statusMessage:'Unauthorized'};

  if (!req.headers.authorization) {
    next(invalidErr);
    return;
  }

  let token = req.headers.authorization.split(' ').pop();

  let validUser;
  // try{
  //   validUser = await User.authenticateToken(token);
  // }
  // catch (err){
  //   next(invalidErr);
  //   return;
  // }

  // req.user = validUser;
  req.token = token;



  next();
};
