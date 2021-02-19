'use strict';

module.exports = (service) =>{

  if (!service || !Array.isArray(service.urls)) {
    return;
  }

  if (service.urls.length === 1) {
    return service.urls[0];

  } else {

    const nextIndex = (service.currentIndex + 1 === service.urls.length ) ? 0 : service.currentIndex + 1;
    service.currentIndex = nextIndex;

    return service.urls[nextIndex];
  }
};