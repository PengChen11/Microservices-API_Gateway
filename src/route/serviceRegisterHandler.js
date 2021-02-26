'use strict';
module.exports = (req, res, next) =>{

  try {
    if (!global.services[req.body.service_name]) {

      global.services[req.body.service_name]={
        urls : [req.body.service_url],
        currentIndex : 0,
      };
      res.status(200).send('new register');
      res.end();

    } else {
      if (!global.services[req.body.service_name].urls.includes(req.body.service_url)){

        global.services[req.body.service_name] = {
          ...global.services[req.body.service_name],
          urls: [...global.services[req.body.service_name].urls, req.body.service_url],
        };
        res.status(200).send('new register');
        res.end();
      } 
    }
    
    res.status(200).send('existing service');
    res.end();

    // delete when deploying
    console.log('global services ', global.services);
  }
  catch (error){
    next (error);
  }
};