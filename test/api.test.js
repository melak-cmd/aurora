// test/api.test.js
const nock = require('nock');

const API_HOST = 'https://api.restful-api.dev';

const mockObjects = [
  { id: '1', name: 'Google Pixel 6 Pro', data: { color: 'Cloudy White', capacity: '128 GB' } },
  { id: '7', name: 'Nintendo Switch', data: null },
];

let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

const request = require('supertest');
const { listObjects } = require('../index'); // helper function

// Import your app if you export it from index.js
const app = require('../index').app;

describe('API Tests', function () {
  this.timeout(5000);

  it('listObjects() should return an array of objects', async () => {
    nock(API_HOST)
      .get('/objects')
      .reply(200, mockObjects);

    const data = await listObjects();
    expect(data).to.be.an('array');
    expect(data.length).to.be.greaterThan(0);
    expect(data[0]).to.have.property('id');
  });

  it('GET /api/objects should return JSON array', async () => {
    nock(API_HOST)
      .get('/objects')
      .reply(200, mockObjects);

    const res = await request(app).get('/api/objects');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('id');
  });

  it('GET /api/objects/:id should return single object', async () => {
    nock(API_HOST)
      .get('/objects/7')
      .reply(200, mockObjects[1]);

    const res = await request(app).get('/api/objects/7');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', '7');
    expect(res.body).to.have.property('name');
  });
});
