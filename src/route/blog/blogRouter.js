//  blog router handles all CRUD operations to blogging service. 

'use strict';

const express = require('express');
const blogRouter = express.Router();

// All middlewares
const basicAuth = require('../../middleware/basicAuth.js');
const bearerAuth = require('../../middleware/bearerAuth.js');
const adminValidation = require('../../middleware/adminValidation.js');
const userValidation = require('../../middleware/userValidation.js');
const roleValidation = require('../../middleware/roleValidation.js');

// all routes handlers
const {getAll, getOne, updateOne, createOne, deleteOne} = require('./blogRouteHandler.js');

// user authentication service routes



blogRouter.get('/:model/:id', getOne); 
blogRouter.get('/:model', getAll);
blogRouter.post('/:model', bearerAuth, adminValidation, createOne);
blogRouter.patch('/:model/:id', bearerAuth, adminValidation,updateOne);
blogRouter.delete('/:model/:id', bearerAuth, adminValidation,deleteOne);


module.exports = blogRouter;
