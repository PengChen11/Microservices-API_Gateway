//  monitor router handles all CRUD operations to system monitoring service. 
'use strict';

const express = require('express');
const monitorRouter = express.Router();

// All middlewares
const bearerAuth = require('../../middleware/bearerAuth.js');
const adminValidation = require('../../middleware/adminValidation.js');
const serviceValidation = require('../../middleware/serviceValidation.js');

// all routes handlers
const {getAll, getOneById, getAllByServiceName, createOne, deleteOne, deleteAll} = require('./monitorRouterHandler.js');

// system monitor logging service routes for admins
monitorRouter.get('/:model', bearerAuth, adminValidation,getAll);

monitorRouter.get('/:model/service/:service_name',bearerAuth, adminValidation, getAllByServiceName);

monitorRouter.get('/:model/:id', bearerAuth, adminValidation,getOneById); 

monitorRouter.post('/:model', bearerAuth, serviceValidation, createOne);

monitorRouter.delete('/:model/:id', bearerAuth, adminValidation,deleteOne);

monitorRouter.delete('/:model/', bearerAuth, adminValidation,deleteAll);

module.exports = monitorRouter;
