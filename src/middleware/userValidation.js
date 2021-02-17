'use strict';

const userModel = require('../model/userModel.js');

module.exports = async (req, res, next)=>{
  let userValidationErr = {message_spec: 'You can NOT modify other user\'s profile', statusCode:401, statusMessage:'user validation error'};
  let nonExistErr = {message_spec: 'The user does not exist', statusCode:401, statusMessage:'non existing user'};

  if (req.user.role==='admin'){
    //Admin can do all kinds of modification, but got to make sure the user DO exist first.
    if (req.method !== 'DELETE'){
      // Delete operation does not need a body, thus not included in this logic.
      let user;
      try{
        user = await userModel.findOne({username: req.body.username});
      }
      catch (err){
        next(err);
      }
      if (!user) {
        next(nonExistErr);
        return;
      }
      next();
      return;
    } else {
      // Admin got to go next and skipping the other logic
      next();
      return;
    }
  }

  // global non delete operatioin for all non admin users
  if (req.method!='DELETE'){
    let reqestingUser = req.user.username;
    let targetUser = req.body.username;

    if (reqestingUser != targetUser) {
      next(userValidationErr);
      return;
    }

    // if it's a update operation, then requesting user, target user, and the DB search back user with ID all need to match.
    if (req.params.id){
      let result;
      try{
        result = await userModel.findById(req.params.id);
      }
      catch (err){
        next(err);
      }

      if (result.username != req.body.username){
        next(userValidationErr);
        return;
      }
    }
    next();
  } else {
    // for delete operation, then the requesting user info need to match the DB id search
    let result;
    try{
      result = await userModel.findById(req.params.id);
    }
    catch (err){
      next(err);
    }
    if (result.username != req.user.username){
      next(userValidationErr);
      return;
    }
    next();
  }

};
