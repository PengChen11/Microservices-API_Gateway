'use strict';
const axios = require('axios');
const loadBalancer = require('../../tool/loadBalancer.js');


const authServiceError = {'message_spec': 'User Authentication service is currently off line, please try again later', 'statusCode': 410, 'statusMessage': 'Connection Error' };

async function signup (req, res, next){
  console.log('***** sign up handler path', req.path);

  const missingKeyError = { 'message_spec': 'username, password are required when registering a new user, please try again', 'statusCode': 400, 'statusMessage': 'Missing user data' };

  if (!req.body.username || !req.body.password) {
    next(missingKeyError);
    return;
  }
  const authServiceURL = loadBalancer(global.services['authService']);
  if (authServiceURL) {
    const reqConfig = {
      method: 'post',
      url: `${authServiceURL}${req.path}`,
      data: req.body,
    };
    console.log('******** handler config', reqConfig);

    try {
      const response = await axios(reqConfig);
      res.status(200).send(response.data);

    } catch( error ){
      const signupError = {'message_spec':error.response.data , 'statusCode': error.response.status, 'statusMessage': error.response.statusText };
      next(signupError);
      return;
    }

  } else {
    next(authServiceError);
    return;
  }
}

async function signin (req, res, next){
  res.send({token: req.token, username:req.username});
}


function handlerGenerator (method){
  return async (req, res, next)=>{
    const id = req.params.id ? {_id:req.params.id } : {};

    // try{
    //   let result;
    //   switch(method){
    //     case 'find':
    //       result = await userModel.find(id);
    //       break;
    //     case 'updatePassword':
    //       result = await userModel.findOneAndUpdate({username:req.body.username}, {password:req.body.password}, {new:true});
    //       break;
    //     case 'delete':
    //       result = await userModel.findByIdAndDelete(id);
    //   }
    //   res.json(result);
    // }
    // catch (err){
    //   next(err);
    // }
  };
}

const getAll = handlerGenerator('find');
const getOne = handlerGenerator('find');
const updatePassword = handlerGenerator('updatePassword');
const deleteOne = handlerGenerator('delete');


module.exports = {signup, signin, getAll, getOne, updateOne: updatePassword, deleteOne};