'use strict';
const loadBalancer = require('../../src/tool/loadBalancer.js');

const services = {};

describe.skip (' load balancer tests', ()=> {

  it('testing to return nothing if given data is broken', ()=>{
    const service = {
      urls: 'http://test1.com',
      currentIndex: 0,
    };

    const returnURL = loadBalancer(service);
    expect(returnURL).toBeUndefined();

    const returnURL2 = loadBalancer();
    expect(returnURL2).toBeUndefined();
  });


  it('testing to return the url if given urls array only have one item', ()=>{
    const service = {
      urls: ['http://test1.com'],
      currentIndex: 0,
    };

    const returnURL = loadBalancer(service);
    expect(returnURL).toBe('http://test1.com');

  });


  it('testing to return the correct url if given urls array contains more than one item', ()=>{

    services.test = {
      urls: [
        'http://test1.com',
        'http://test2.com',
        'http://test3.com',
      ],
      currentIndex: 0,
    };


    const returnURL1 = loadBalancer(services.test);
    expect(returnURL1).toBe('http://test2.com');

    const returnURL2 = loadBalancer(services.test);
    expect(returnURL2).toBe('http://test3.com');

    const returnURL3 = loadBalancer(services.test);
    expect(returnURL3).toBe('http://test1.com');

  });
});