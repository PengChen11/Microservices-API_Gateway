'use strict';
const axios = require('axios');
const loadBalancer = require('../../tool/loadBalancer.js');

const monitorServiceError = {'message_spec': 'Blog service is currently off line, please try again later', 'statusCode': 410, 'statusMessage': 'Connection Error' };

function handlerGenerator (method){
  
  return async (req, res, next)=>{
    // get the URL from load balancer
    const monitorServiceURL = loadBalancer(global.services['monitorService']);
    
    if (!monitorServiceURL) {
      next(monitorServiceError);
      return;
    } 

    const id = req.params.id;
    const serviceName = req.params.service_name;
    const modelPath = req.params.model;
    // if requesting path is not projects nor articles, user get 404
    if (modelPath !='projects' && modelPath != 'articles') {
      next();
      return;
    }
    
    let reqConfig;

    switch(method){

      case 'getAll': 
        reqConfig = {
          method: 'get',
          url: `${monitorServiceURL}/${modelPath}`,
        }; 
        break;

      case 'getOneById':
        reqConfig = {
          method: 'get',
          url: `${monitorServiceURL}/${modelPath}/${id}`,
        }; 
        break;

      case 'getAllByServiceName':
        reqConfig = {
          method: 'get',
          url: `${monitorServiceURL}/${modelPath}/service/${serviceName}`,
          data: req.body,
        }; 
        break;

      case 'createOne':
        reqConfig = {
          method: 'post',
          url: `${monitorServiceURL}/${modelPath}`,
          data: req.body,
        }; 
        break;


      case 'deleteOne':
        reqConfig = {
          method: 'delete',
          url: `${monitorServiceURL}/${modelPath}/${id}`,
        };
        break;

      case 'deleteAll':
        reqConfig = {
          method: 'delete',
          url: `${monitorServiceURL}/${modelPath}`,
        };
        break;
    }

    try {
      const {data} = await axios(reqConfig);
      res.status(200).send(data);
    }
    catch (error){
      const reqError = {'message_spec':error.response.data , 'statusCode': error.response.status, 'statusMessage': error.response.statusText };
      next(reqError);
    }
  };
}

const getAll = handlerGenerator('getAll');
const getOneById = handlerGenerator('getOneById');
const getAllByServiceName = handlerGenerator('getAllByServiceName');
const createOne = handlerGenerator('createOne');
const deleteOne = handlerGenerator('deleteOne');
const deleteAll = handlerGenerator('deleteAll');

module.exports = {getAll, getOneById, getAllByServiceName, createOne, deleteOne, deleteAll};