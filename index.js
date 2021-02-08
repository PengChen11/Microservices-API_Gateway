'use strict';

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

//router
const router = require('./src/route/router.js');
app.use(router);

// routes error handlers
const fourOfour = require('./src/middleware/404');
app.use('*', fourOfour);
const svrErrors = require('./src/middleware/error');
app.use(svrErrors);


// start server
const port = process.env.PORT || 4444;
app.listen(port, ()=>{
  console.log(`listening on port ${port}`);
});



