'use strict';
require('dotenv').config();
const server = require('./src/server.js');

global.localLog = [];
global.services = {
  authService: {
    urls:[process.env.AUTH_SERVICE_URL],
    currentIndex: 0,
  },
};



// start server
server.start();


