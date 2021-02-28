'use strict';
// require( 'dotenv' ).config();
const server = require( '../../index.js' );
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose( server );

// to get rid of all console logs, make it clean
console.log = jest.fn();

// global.services = {};
beforeAll ((done)=>{
  global.services = {};
  done();
});

afterEach ((done)=>{
  global.services = {};
  done();
});


describe.skip ('tests for service registering route', ()=>{

  it('should register new services url', async()=>{
    const serviceData= {
      service_name: 'authService',
      service_url: 'http://test1.com',
    };

    const result = await mockRequest.post('/service-register').send(serviceData);

    expect(result.status).toBe(200);

    expect(global.services[serviceData.service_name].urls).toStrictEqual([serviceData.service_url]);

    expect(global.services[serviceData.service_name].currentIndex).toBe(0);
  });


  it('should register different new services url', async()=>{
    const blogService= {
      service_name: 'blogService',
      service_url: 'http://test2.com',
    };

    const result = await mockRequest.post('/service-register').send(blogService);

    expect(result.status).toBe(200);

    expect(global.services[blogService.service_name].urls).toStrictEqual([blogService.service_url]);

    expect(global.services[blogService.service_name].currentIndex).toBe(0);

    const authService= {
      service_name: 'authService',
      service_url: 'http://test1.com',
    };

    const result2 = await mockRequest.post('/service-register').send(authService);

    expect(result2.status).toBe(200);

    expect(global.services[authService.service_name].urls).toStrictEqual([authService.service_url]);

    expect(global.services[authService.service_name].currentIndex).toBe(0);
  });


  it('should register all urls to the same service', async()=>{
    const blogService1= {
      service_name: 'blogService',
      service_url: 'http://test1.com',
    };

    const blogService2= {
      service_name: 'blogService',
      service_url: 'http://test2.com',
    };

    await mockRequest.post('/service-register').send(blogService1);

    await mockRequest.post('/service-register').send(blogService2);

    expect(global.services[blogService1.service_name].urls).toStrictEqual([blogService1.service_url, blogService2.service_url]);

    expect(global.services[blogService1.service_name].currentIndex).toBe(0);
  });

});
