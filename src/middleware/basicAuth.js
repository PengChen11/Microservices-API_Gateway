'use strict';
const base64 = require('base-64');
const axios = require('axios');
const loadBalancer = require('../tool/loadBalancer.js');


module.exports = async (req, res, next)=>{

  const loginError = { 'message_spec': 'Invalid user ID or password. Please try again', 'statusCode': 401, 'statusMessage': 'Login Failed' };
  
  if (!req.headers.authorization) {
    next(loginError);
    return;
  }
  
  const basic = req.headers.authorization.split(' ').pop();
  const [username, password] = base64.decode(basic).split(':');
  if (!username || !password) {
    next(loginError);
    return;
  }

  const authServiceURL = loadBalancer(global.services['authService']);
  const authServiceError = {'message_spec': 'User Authentication service is currently off line, please try again later', 'statusCode': 410, 'statusMessage': 'Connection Error' };

  if (authServiceURL) {
  
    const reqConfig = {
      method: 'post',
      url: `${authServiceURL}/signin`,
      auth: {
        username,
        password,
      },
    };

    try{
      const response = await axios(reqConfig);
      req.token = response.data.token;
      req.username = response.data.username;
      next();
      return;
    }
    catch (error) {
      const signinError = {'message_spec':error.response.data , 'statusCode': error.response.status, 'statusMessage': error.response.statusText };
      next(signinError);
      return;
    }
  }else {
    next(authServiceError);
    return;
  }
};
