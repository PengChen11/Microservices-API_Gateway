//  user router handles all authentication requests for both regulaer users and services. All micro-services are treated as a user in this system.

'use strict';

const express = require('express');
const authRouter = express.Router();

// All middlewares
const basicAuth = require('../../middleware/basicAuth.js');
const bearerAuth = require('../../middleware/bearerAuth.js');
const adminValidation = require('../../middleware/adminValidation.js');
const userValidation = require('../../middleware/userValidation.js');
const roleValidation = require('../../middleware/roleValidation.js');

// all routes handlers
const {signup, adminSignup, signin, getAll, getOne, updateOne, updatePassword, deleteOne} = require('./authRouteHandler.js');

// user authentication service routes

authRouter.post('/signup', roleValidation, signup);

authRouter.post('/adminsignup', bearerAuth, adminValidation, adminSignup); // admin signup, admin can be only added by another admin.

authRouter.post('/signin', basicAuth, signin);

authRouter.get('/allusers', bearerAuth, adminValidation, getAll); // only Admin can see all users info

authRouter.get('/user/:id', bearerAuth, userValidation,getOne); 

authRouter.patch('/user/:id/password', bearerAuth, userValidation, updatePassword);

authRouter.patch('/user/:id', bearerAuth, userValidation, updateOne);

authRouter.delete('/user/:id', bearerAuth, userValidation, deleteOne);

module.exports = authRouter;
