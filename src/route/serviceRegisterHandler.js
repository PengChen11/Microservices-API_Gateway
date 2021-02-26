'use strict';
module.exports = (req, res, next) =>{

  try {
    if (!global.services[req.body.service_name]) {

      global.services[req.body.service_name]={
        urls : [req.body.service_url],
        currentIndex : 0,
      };
      return res.status(200).send('new register');

    } else if (!global.services[req.body.service_name].urls.includes(req.body.service_url)){

      global.services[req.body.service_name] = {
        ...global.services[req.body.service_name],
        urls: [...global.services[req.body.service_name].urls, req.body.service_url],
      };
      return res.status(200).send('new register');
    } 
    
    res.status(200).send('existing service');

    // delete when deploying
    console.log('global services ', global.services);
  }
  catch (error){
    next ('****** service register handler error',error);
  }
};