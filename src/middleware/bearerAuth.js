'use strict';
const axios = require('axios');
const loadBalancer = require('../tool/loadBalancer.js');

module.exports = async (req, res, next) => {

  const authenticationErr = {message_spec: 'You are not authenticated. Please login again.', statusCode: 401, statusMessage:'Unauthenticated'};

  if (!req.headers.authorization) {
    next(authenticationErr);
    return;
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
      return;
    }
    catch (error) {
      const bearerError = {'message_spec':error.response.data , 'statusCode': error.response.status, 'statusMessage': error.response.statusText };
      next(bearerError);
      return;
    }
  }else {
    next(authServiceError);
    return;
  }
};
