'use strict';
const axios = require('axios');
const loadBalancer = require('../tool/loadBalancer.js');
const middlewareAxiosErrorHandler = require('../tool/middlewareAxiosErrorHandler.js');

module.exports = async (req, res, next) => {

  const authenticationErr = {message_spec: 'User can NOT be authenticated. Please login again.', statusCode: 401, statusMessage:'Unauthenticated'};

  if (!req.headers.authorization) {
    next(authenticationErr);
  }

  const token = req.headers.authorization.split(' ').pop();

  const authServiceURL = loadBalancer(global.services['authService']);

  
  const authServiceError = {'message_spec': 'User Authentication service is currently off line, please try again later', 'statusCode': 410, 'statusMessage': 'Connection Error' };

  if (authServiceURL) {
  
    const reqConfig = {
      method: 'post',
      url: `${authServiceURL}/verify`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try{
      const {data} = await axios(reqConfig);
      req.token = token;
      req.user = data;
      next();
    }
    catch (error) {
      middlewareAxiosErrorHandler(error, authServiceError, next, 'authService', authServiceURL);
    }
  }else {
    next(authServiceError);
  }
};
