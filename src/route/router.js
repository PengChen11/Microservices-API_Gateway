'use strict';

const express = require('express');
const router = express.Router();

const os=require('os');
const networkInterfaces = os.networkInterfaces();

router.get('/', (req, res, next)=>{
  res.send({
    network: networkInterfaces,
    requestHeaders: req.headers,
  });
});



module.exports = router;
