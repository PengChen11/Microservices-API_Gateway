'use strict';

const userModel = require('../model/userModel.js');
const serviceModel = require('../model/serviceModel.js');

async function signup (req, res, next){
  let missingKeyError = { 'message_spec': 'Missing required data when registering, please try again', 'statusCode': 403, 'statusMessage': 'Missing Key info' };

  let requiredKeys = ['username', 'password'];
  let userInput = Object.keys(req.body);
  if (!requiredKeys.every(key=>userInput.includes(key))) {
    next(missingKeyError);
    return;
  }

  let uniqueError = { 'message_spec': 'Username taken, please choose another one', 'statusCode': 403, 'statusMessage': 'Unique Fail' };
  try {
    let user = new userModel(req.body);
    let valid = await userModel.findOne({username: user.username});
    if(!valid){
      try{
        let savedUser = await user.save();
        let token = savedUser.tokenGenerator();
        res.status(200).send({token:token});
      } catch (error) {
        next(error);
      }
    } else {
      next(uniqueError);
    }
  }
  catch (err){
    next(err);
  }
}

async function signin (req, res, next){
  res.cookie('auth', req.token);
  res.send({token: req.token});
}

async function showAll (req, res, next){
  try {
    let result = await userModel.find({});
    res.json(result);
  }
  catch (err){
    next (err);
  }
}

module.exports = {signup, signin, showAll};
