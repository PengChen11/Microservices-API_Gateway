'use strict';
// require( 'dotenv' ).config();
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

// make axios returns fake ok
axios.mockImplementation(() => Promise.resolve('ok'));


describe('Bad route tests', ()=>{

  test('Should hit 404 if routes does not exsit', async()=>{
    const result = await mockRequest.get('/api/v1/auth/badurl');
    expect(result.status).toBe(404);
  });
});

describe('/signup route tests', ()=>{
  
  test('Should reject user registering request with bad user name / password', async () => {
    const badUsernameData = {
      username: '123456789012345678901234567890',
      password: '1234567890',
    };

    const badPasswordData = {
      username: '1234567890123456789',
      password: '123',
    };

    const badUsernameResult = await mockRequest.post('/api/v1/auth/signup').send(badUsernameData);
    expect(badUsernameResult.status).toBe(422);

    const badPasswordResult = await mockRequest.post('/api/v1/auth/signup').send(badPasswordData);
    expect(badPasswordResult.status).toBe(422);
  });

  test('Should reject user registering request with unauthorized role', async () => {
    const badUserRoleData1 = {
      username: '1234567890',
      password: '1234567890',
      role: 'admin',
    };

    const badUserRoleData2 = {
      username: '1234567890',
      password: '1234567890',
      role: 'something does not exsit',
    };

    const badUserRoleResult1 = await mockRequest.post('/api/v1/auth/signup').send(badUserRoleData1);
    expect(badUserRoleResult1.status).toBe(403);

    const badUserRoleResult2 = await mockRequest.post('/api/v1/auth/signup').send(badUserRoleData2);
    expect(badUserRoleResult2.status).toBe(403);
  });

  test('Should register new user with good data', async () => {
    const goodData1 = {
      username: '1234567890',
      password: '1234567890',
    };

    const goodData2 = {
      username: '1234567890',
      password: '1234567890',
      role: 'user',
    };

    const goodDataResult1 = await mockRequest.post('/api/v1/auth/signup').send(goodData1);
    expect(goodDataResult1.status).toBe(200);

    const goodDataResult2 = await mockRequest.post('/api/v1/auth/signup').send(goodData2);
    expect(goodDataResult2.status).toBe(200);
  });

});



describe ( '/adminsignup route tests', ()=>{

  test('should reject non-admin user regestering new addmin user', async ()=>{
    // create a fake bearer auto response.
    axios.mockImplementation(() => Promise.resolve({
      data: {
        username: 'testuser',
        role:'user',
      },
    }));

    const fakeAdmin = {
      username: '1234567890',
      password: '1234567890',
      role: 'admin',
    };

    const result = await mockRequest.post('/api/v1/auth/adminsignup').send(fakeAdmin).auth( 'token', { type: 'bearer' } );

    expect(result.status).toBe(401);
  });

  test('should grant admin user to regester new addmin user', async ()=>{
    // create a fake bearer auto response.
    axios.mockImplementation(() => Promise.resolve({
      data: {
        username: 'testuser',
        role:'admin',
      },
    }));

    const fakeAdmin = {
      username: '1234567890',
      password: '1234567890',
      role: 'admin',
    };

    const result = await mockRequest.post('/api/v1/auth/adminsignup').send(fakeAdmin).auth( 'token', { type: 'bearer' } );

    expect(result.status).toBe(200);
  });
});


describe('/signin route tests', ()=>{

  test ( 'should NOT allow user signin with bad Credential', async ()=>{
    axios.mockImplementation(() => Promise.reject({
      response: {
        data: 'Invalid username or password. Please try again.',
        status: 401,
        statusText: 'Unauthenticated',
      },
    }));

    const result = await mockRequest.post('/api/v1/auth/signin').auth('badusername', 'badpassword');
    expect(result.status).toBe(401);
  });

  test ( 'should allow user signin with good Credential', async ()=>{
    axios.mockImplementation(() => Promise.resolve({
      data: {
        token: 'token',
        user: {
          username:'test',
        },
      },
    }));

    const result = await mockRequest.post('/api/v1/auth/signin').auth('goodusername', 'goodpassword');
    expect(result.status).toBe(200);
  });
});

describe('/allusers route tests', ()=>{

  it ('should block non admin access all users data', async()=>{
    axios.mockImplementation(() => Promise.resolve({
      data: {
        username: 'testuser',
        role:'user',
      },
    }));

    const result = await mockRequest.get('/api/v1/auth/allusers').auth( 'token', { type: 'bearer' } );

    expect(result.status).toBe(401);
  });

  it ('should block non admin access all users data', async()=>{
    axios.mockImplementation(() => Promise.resolve({
      data: {
        username: 'testadmin',
        role:'admin',
      },
    }));

    const result = await mockRequest.get('/api/v1/auth/allusers').auth( 'token', { type: 'bearer' } );

    expect(result.status).toBe(200);
  });
});








