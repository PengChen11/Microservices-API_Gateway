'use strict';
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// app.use(express.static('./public'));
const logger = require('./middleware/logger.js');
app.use(logger);


//routers
const registerRouter = require('./route/serviceRegisterRouter.js');
app.use('/api/v1', registerRouter);


const authRouter = require('./route/auth/authRouter.js');
app.use('/api/v1/auth',authRouter);

// const authRouterV2 = require('./route/auth/authRouterV2.js');
// app.use('/api/v2/auth',authRouterV2);

const blogRouter = require('./route/blog/blogRouter.js');
app.use('/api/v1/blog',blogRouter);

const monitorRouter = require('./route/monitor/monitorRouter.js');
app.use('/api/v1/monitor',monitorRouter);


// routes error handlers
const fourOfour = require('./middleware/404');
app.use('*', fourOfour);
const svrErrors = require('./middleware/error');
app.use(svrErrors);



module.exports={
  server: app,
  start: (port) => {
    const PORT = process.env.PORT || port || 4444;
    app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
  },
};