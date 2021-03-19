'use strict';
const {server} = require( '../../src/server.js' );
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose( server );
const axios = require('axios');
jest.mock('axios');

// to get rid of all console logs, make it clean
console.log = jest.fn();

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

// makes axios return fake ok
axios.mockImplementation(() => Promise.resolve('ok'));

describe('Blog routes tests', ()=>{
  
  test('should hit 404 if routes does not exsit', async()=>{
    const result = await mockRequest.get('/api/v1/auth/badurl');
    expect(result.status).toBe(404);
  });

  test('should fetch articles',async () => {
    const  reqConfig = {
      method: 'get',
      url: 'http://test2.com/articles',
      params: {},
    }; 
    
    await mockRequest.get('/api/v1/blog/articles');
  
    expect(axios).toHaveBeenCalledWith(reqConfig);
  });

  test('should fetch one article',async () => {
    const  reqConfig = {
      method: 'get',
      url: 'http://test2.com/articles/123456',
    }; 
    
    await mockRequest.get('/api/v1/blog/articles/123456');
  
    expect(axios).toHaveBeenCalledWith(reqConfig);
  });

  
});