'use strict';
require('dotenv').config();

global.localLog = [];
global.services = {
  authService: {
    urls:[process.env.AUTH_SERVICE_URL],
    currentIndex: 0,
  },
};

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// app.use(express.static('./public'));
const timeStamp = require('./src/middleware/timeStamp.js');
app.use(timeStamp);
const logger = require('./src/middleware/logger.js');
app.use(logger);


//routers
const registerRouter = require('./src/route/serviceRegisterRouter.js');
app.use('/api/v1', registerRouter);


const authRouter = require('./src/route/auth/authRouter.js');
app.use('/api/v1/auth',authRouter);

// const authRouterV2 = require('./src/route/auth/authRouterV2.js');
// app.use('/api/v2/auth',authRouterV2);

const blogRouter = require('./src/route/blog/blogRouter.js');
app.use('/api/v1/blog',blogRouter);

const monitorRouter = require('./src/route/monitor/monitorRouter.js');
app.use('/api/v1/monitor',monitorRouter);


// routes error handlers
const fourOfour = require('./src/middleware/404');
app.use('*', fourOfour);
const svrErrors = require('./src/middleware/error');
app.use(svrErrors);


// start server
const port = process.env.PORT || 4444;
app.listen(port, ()=>{
  console.log(`listening on port ${port}`);
  console.log(' curernt service list:', global.services);
});




