'use strict';
module.exports = (req, res, next) => {

  let ip = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || 'No IP detected';
  let reqRecord = {
    ip: ip,
    method: req.method,
    time: req.requestTime,
    targetUrl: req.path,
  };

  console.log('\n', `Web request from IP address: "${ip}" `, '\n', `  Using "${req.method}" method`, '\n', `  At ${req.requestTime}`, '\n', `  The requested URL is "${req.path}"`, '\n');
  
  next();
};
