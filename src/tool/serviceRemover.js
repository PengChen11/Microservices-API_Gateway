'use strict';

module.exports = (serviceName, serviceURL)=>{
  
  // remove dead service url from global service list
  // Do not remove the auth service url if there's only one left. Otherwise nobody will be able to register themselves. 
  
  if (serviceName==='authService' && global.services[serviceName].urls.length ===1) {
    return;
  }

  global.services[serviceName]={
    urls: global.services[serviceName].urls.filter(url => url != serviceURL),
    currentIndex: global.services[serviceName].currentIndex-1 < 0 ? 0 : global.services[serviceName].currentIndex-1,
  };
};
