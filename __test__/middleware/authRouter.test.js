'use strict';
// require( 'dotenv' ).config();
const server = require( '../../index.js' );
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose( server );
const axios = require('axios');
jest.mock('axios');


// to get rid of all console logs, make it clean
console.log = jest.fn();

test.skip('good response', () => {
  axios.get.mockImplementation(() => Promise.resolve({ data: {a: 1} }));
  // ...
});