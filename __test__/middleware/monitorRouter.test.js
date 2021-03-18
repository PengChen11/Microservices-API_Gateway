'use strict';
// require( 'dotenv' ).config();
const {server} = require( '../../src/server.js' );
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose( server );
const axios = require('axios');
jest.mock('axios');

// to get rid of all console logs, make it clean
console.log = jest.fn();

// jest.mock('basicAuth', ()=> jest.fn((req,res,next)=> next()));
// const basicAuth = require('../../src/middleware/basicAuth');


// setup fake URLs for microservices
global.services = {
  authService: {
    urls:['http://test1.com'],
    currentIndex: 0,
  },
  blogService: {
    urls: ['http://test2.com'],
    currentIndex: 0,
  },
  monitorService: {
    urls: ['http://test3.com'],
    currentIndex: 0,
  },
};

// make axios returns fake ok
axios.mockImplementation(() => Promise.resolve('ok'));


describe('Authentication routes tests', ()=>{
  
  test('should hit 404 if routes does not exsit', async()=>{
    const result = await mockRequest.get('/api/v1/auth/badurl');
    expect(result.status).toBe(404);
  });

});







