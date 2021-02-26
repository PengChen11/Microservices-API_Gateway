'use strict';

const express = require('express');
const serviceRegisterRouter = express.Router();

const bearerAuth = require('../middleware/bearerAuth.js');
const serviceValidation = require('../middleware/serviceValidation.js');


const registerHandler = require('./serviceRegisterHandler.js');

serviceRegisterRouter.post('/service-register', bearerAuth, serviceValidation, registerHandler);

module.exports = serviceRegisterRouter;