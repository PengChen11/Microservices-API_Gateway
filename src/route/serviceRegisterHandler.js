'use strict';
module.exports = (req, res, next) =>{
  try {
    if (!global.services[req.body.service_name]) {
      global.services[req.body.service_name]=[req.body.service_url];
    } else {
      if (!global.services[req.body.service_name].includes(req.body.service_url)){
        global.services[req.body.service_name] = [...global.services[req.body.service_name],req.body.service_url];
      }
    }
    res.status(200).send('ok');
  }
  catch (error){
    next (error)
  }
}