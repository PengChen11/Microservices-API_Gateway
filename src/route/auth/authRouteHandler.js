'use strict';
const axios = require('axios');
const loadBalancer = require('../../tool/loadBalancer.js');
const middlewareAxiosErrorHandler = require('../../tool/middlewareAxiosErrorHandler.js');

const authServiceError = {'message_spec': 'User Authentication service is currently off line, please try again later', 'statusCode': 410, 'statusMessage': 'Connection Error' };

async function signup (req, res, next){

  const missingKeyError = { 'message_spec': 'username, password are required when registering a new user, please try again', 'statusCode': 400, 'statusMessage': 'Missing user data' };

  if (!req.body.username || !req.body.password) {
    next(missingKeyError);
  }
  const authServiceURL = loadBalancer(global.services['authService']);
  if (authServiceURL) {
    const reqConfig = {
      method: 'post',
      url: `${authServiceURL}${req.path}`,
      data: req.body,
    };

    try {
      const {data} = await axios(reqConfig);
      res.status(200).send(data);

    } catch( error ){
      middlewareAxiosErrorHandler(error, authServiceError, next, 'authService', authServiceURL);
    }

  } else {
    next(authServiceError);
  }
}

async function adminSignup (req, res, next){

  const missingKeyError = { 'message_spec': 'username, password and role are required when registering a new admin or microservice, please try again', 'statusCode': 400, 'statusMessage': 'Missing user data' };

  if (!req.body.username || !req.body.password || !req.body.role) {
    next(missingKeyError);
    return;
  }

  if (!['admin', 'service'].includes(req.body.role) ) {
    next(missingKeyError);
    return;
  }

  const authServiceURL = loadBalancer(global.services['authService']);
  if (authServiceURL) {
    const reqConfig = {
      method: 'post',
      url: `${authServiceURL}${req.path}`,
      data: req.body,
      headers: {
        Authorization: `Bearer ${req.token}`,
      },
    };

    try {
      const {data} = await axios(reqConfig);
      res.status(200).send(data);

    } catch( error ){
      middlewareAxiosErrorHandler(error, authServiceError, next, 'authService', authServiceURL);
    }

  } else {
    next(authServiceError);
  }
}

async function signin (req, res, next){
  res.send({
    token: req.token,
    user: req.user,
  });
}

function handlerGenerator (method){
  
  return async (req, res, next)=>{
    const authServiceURL = loadBalancer(global.services['authService']);
    const id = req.params.id;
    let reqConfig;

    if (!authServiceURL) next(authServiceError);

    switch(method){

      case 'findAll': 
        reqConfig = {
          method: 'get',
          url: `${authServiceURL}/allusers`,
          headers: {
            Authorization: `Bearer ${req.token}`,
          },
        }; 
        break;

      case 'findOne':
        reqConfig = {
          method: 'get',
          url: `${authServiceURL}/user/${id}`,
          headers: {
            Authorization: `Bearer ${req.token}`,
          },
        }; 
        break;

      case 'updateOne':
        reqConfig = {
          method: 'patch',
          url: `${authServiceURL}/user/${id}`,
          headers: {
            Authorization: `Bearer ${req.token}`,
          },
          data: req.body,
        }; 
        break;

      case 'updatePassword':
        reqConfig = {
          method: 'patch',
          url: `${authServiceURL}/user/${id}/password`,
          headers: {
            Authorization: `Bearer ${req.token}`,
          },
          data: req.body,
        }; 
        break;

      case 'delete':
        reqConfig = {
          method: 'delete',
          url: `${authServiceURL}/user/${id}`,
          headers: {
            Authorization: `Bearer ${req.token}`,
          },
        }; 
        break;
    }

    try {
      const {data} = await axios(reqConfig);
      res.status(200).send(data);
    }
    catch (error){
      middlewareAxiosErrorHandler(error, authServiceError, next, 'authService', authServiceURL);
    }
  };
}

const getAll = handlerGenerator('findAll');
const getOne = handlerGenerator('findOne');
const updateOne = handlerGenerator('updateOne');
const updatePassword = handlerGenerator('updatePassword');
const deleteOne = handlerGenerator('delete');


module.exports = {signup, adminSignup, signin, getAll, getOne, updateOne, updatePassword, deleteOne};