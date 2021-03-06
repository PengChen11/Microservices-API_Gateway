'use strict';
const base64 = require('base-64');
const axios = require('axios');
const loadBalancer = require('../tool/loadBalancer.js');
const middlewareAxiosErrorHandler = require('../tool/middlewareAxiosErrorHandler.js');

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
      const {data} = await axios(reqConfig);
      req.token = data.token;
      req.user = data.user;
      next();
      return;
    }
    catch (error) {
      middlewareAxiosErrorHandler(error, authServiceError, next,'authService', authServiceURL);
    }
  }else {
    next(authServiceError);
    return;
  }
};
