'use strict';
require('dotenv').config();
const axios = require('axios');
const loadBalancer = require('./loadBalancer.js');
const serviceRemover = require('./serviceRemover.js');

module.exports = async (data, logType, type=undefined ) => {

  // record system monitoring log through Sys monitoring service
  const time = new Date();
  // this payload is going to be recorded in DB
  let payload = {
    service_name: 'API Gateway',
    time: time.toISOString(),
    type,
    message: typeof(data)==='string'? data : undefined,
  };
  
  // Only events data came in as String, that's a general messages 
  let logPath;
  switch (logType){

    case 'event':
      logPath = 'events';
      break;
    case 'warning':
      logPath = 'warnings';
      // warning OBJ contains data needs to be parsed.
      payload = {
        ...payload,
        req_ip: data.req_ip,
        method: data.method,
        target_url: data.target_url,
        description: data.description,
        requester: data.requester,
        message: data.message,
      };
      break;
    default:
      logPath = 'errors';
      //Errors Obj contains data needs to be parsed.
      payload = {
        ...payload,
        req_ip: data.req_ip,
        method: data.method,
        target_url: data.target_url,
        description: data.description,
        requester: data.requester,
        message: data.error.message || data.error.message_spec,
        code: data.error.code || data.error.statusCode,
        stack: data.error.stack,
      };
      break;
  }

  // preparing http call to monitoring service
  const monitorServiceURL = loadBalancer(global.services['monitorService']);

  if (monitorServiceURL) {

    try {
      const reqConfig = {
        method: 'post',
        url: `${monitorServiceURL}/${logPath}`,
        data: payload,
      };
      
      await axios(reqConfig);
  
    } catch (error){
      // in general, this only happens when connection to sys monitoring service is lost. We will figure out anothe way to notify admin later.
      // one way is to use AWS SMS Queue service.
      console.log('Error occourred when trying to logging to system monitoring service through API gateway');

      // remove dead link from system memory
      serviceRemover('monitorService', monitorServiceURL);
    }
  } else {
    // have to use another way to notify the admin or temp record the logs if monitoring service is off line.
    console.log('System Monitoring service if OFF line');
  }
};
