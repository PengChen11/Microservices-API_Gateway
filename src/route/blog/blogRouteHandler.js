'use strict';
const axios = require('axios');
const loadBalancer = require('../../tool/loadBalancer.js');

const blogServiceError = {'message_spec': 'Blog service is currently off line, please try again later', 'statusCode': 410, 'statusMessage': 'Connection Error' };

function handlerGenerator (method){
  
  return async (req, res, next)=>{
    // get the URL from load balancer
    const blogServiceURL = loadBalancer(global.services['blogService']);
    
    if (!blogServiceURL) {
      next(blogServiceError);
      return;
    } 

    const id = req.params.id;
    const modelPath = req.params.model;
    // if requesting path is not projects nor articles, user get 404
    if (modelPath !='projects' && modelPath != 'articles') {
      next();
      return;
    }
    
    let reqConfig;

    switch(method){

      case 'findAll': 
        reqConfig = {
          method: 'get',
          url: `${blogServiceURL}/${modelPath}`,
          // headers: {
          //   Authorization: `Bearer ${req.token}`,
          // },
        }; 
        break;

      case 'findOne':
        reqConfig = {
          method: 'get',
          url: `${blogServiceURL}/${modelPath}/${id}`,
          // headers: {
          //   Authorization: `Bearer ${req.token}`,
          // },
        }; 
        break;

      case 'updateOne':
        reqConfig = {
          method: 'patch',
          url: `${blogServiceURL}/${modelPath}/${id}`,
          // headers: {
          //   Authorization: `Bearer ${req.token}`,
          // },
          data: req.body,
        }; 
        break;

      case 'new':
        reqConfig = {
          method: 'post',
          url: `${blogServiceURL}/${modelPath}`,
          // headers: {
          //   Authorization: `Bearer ${req.token}`,
          // },
          data: req.body,
        }; 
        break;


      case 'delete':
        reqConfig = {
          method: 'delete',
          url: `${blogServiceURL}/${modelPath}/${id}`,
          // headers: {
          //   Authorization: `Bearer ${req.token}`,
          // },
        };
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

const getAll = handlerGenerator('findAll');
const getOne = handlerGenerator('findOne');
const updateOne = handlerGenerator('updateOne');
const deleteOne = handlerGenerator('delete');
const createOne = handlerGenerator('new');


module.exports = {getAll, getOne, updateOne, deleteOne, createOne};