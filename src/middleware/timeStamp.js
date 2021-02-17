'use strict';

function timestamp(req, res, next) {

  let today = new Date();
  let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  let output = `${today.toDateString()}  ${time}`;

  // req.requestTime = output;
  req.requestTime = today.toISOString();
  next();
}

module.exports = timestamp;
