'use strict';
// require( 'dotenv' ).config();
const server = require( '../../index.js' );
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose( server );
const axios = require('axios');
jest.mock('axios');


// users.test.js

test('should fetch articles', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});


// to get rid of all console logs, make it clean
console.log = jest.fn();

