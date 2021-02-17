//  user router handles all authentication requests for both regulaer users and services. All micro-services are treated as a user in this system.

'use strict';

const express = require('express');
const authRouter = express.Router();

// user authentication service routes
const {signup, signin, getAll, getOne, updateOne, updatePassword, deleteOne} = require('./authRouteHandler.js');
const basicAuth = require('../../middleware/basicAuth');
const bearerAuth = require('../../middleware/bearer.js');
const adminValidation = require('../../middleware/adminValidation.js');
// const userValidation = require('../../middleware/userValidation.js');
// const roleValidation = require('../middleware/roleValidation.js');

authRouter.post('/signup', signup);

// userRouter.post('/admin-signup', bearerAuth, adminValidation, signup); // admin signup, admin can be only added by another admin.

authRouter.post('/signin', basicAuth, signin);

authRouter.get('/all', bearerAuth, adminValidation, getAll); // only Admin can see all users info

// userRouter.get('/:id', bearerAuth, userValidation, getOne); 

// userRouter.patch('/:id/password', bearerAuth, userValidation, updatePassword);

// userRouter.patch('/:id', bearerAuth, userValidation, updateUserInfo);

// userRouter.delete('/:id', bearerAuth, userValidation, deleteOne);



// service register route, middleware goes here.








module.exports = authRouter;
