'use strict';
const monitor = require('../tool/monitor.js');

module.exports =  (err, req, res, next) => {
  // remove console log when deploy
  console.log('*********500 error here',err);
  res.statusCode = err.statusCode || 500;
  res.statusMessage = err.statusMessage || 'Server internal error occurred. Please try again later.';
  res.send( err.message_spec || 'Server internal error occurred. Please try again later.');
  res.end();

  const ip = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || 'No IP detected';

  const log = {
    req_ip: ip,
    method: req.method,
    target_url: req.originalUrl,
    requester: req.user? JSON.stringify(req.user) : undefined,
  };

  // take all known error as a warning
  if (err.statusCode && err.statusCode != 500){
    const warningLog = {
      ...log,
      description: err.message_spec,
      message: err.statusMessage,
    };

    monitor(warningLog, 'warning', err.statusCode);

  } else {
    // take all other errors as 500 server error.
    const errorLog = {
      ...log,
      description: 'Server internal error occurred',
      error: err,
    };
    monitor(errorLog, 'error', '500');
  }
};
