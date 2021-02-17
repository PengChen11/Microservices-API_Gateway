'use strict';

module.exports = (urlArray) =>{

  if (!Array.isArray(urlArray)) {
    return;
  }

  if (urlArray.length === 1) {
    return urlArray[0];

  } else {
    const index = Math.floor(Math.random()*urlArray.length);
    return urlArray[index];
  }

}