'use strict';
// require( 'dotenv' ).config();
const server = require( '../../index.js' );
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose( server );
const axios = require('axios');
jest.mock('axios');


// to get rid of all console logs, make it clean
console.log = jest.fn();

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


test.skip('should fetch articles',async () => {
  const  data = [{
    'title': 'test article 22222',
    'sub_title': 'something goes here',
    'author': 'Peng Chen',
    'body': 'article text',
    'comments': [],
    'createdAt': '2021-02-23T07:00:26.926Z',
    'updatedAt': '2021-02-23T07:00:26.926Z',
  }];
  axios.mockResolvedValue(() => Promise.resolve(data));

  const fetchData = async () => {
    return await mockRequest.get('/api/v1/blog/articles');
  };
  await expect(fetchData()).resolve.toEqual(data);
});

test('should fetch articles #2', async () => {
  const  data = [{
    'title': 'test article 22222',
    'sub_title': 'something goes here',
    'author': 'Peng Chen',
    'body': 'article text',
    'comments': [],
    'createdAt': '2021-02-23T07:00:26.926Z',
    'updatedAt': '2021-02-23T07:00:26.926Z',
  }];
  
  axios.get.mockImplementationOnce(() => Promise.resolve(data));
  
  const fetchData = async () => {
    return await axios.get('/api/v1/blog/articles');
  };
  await expect(fetchData()).resolves.toEqual(data);
});



