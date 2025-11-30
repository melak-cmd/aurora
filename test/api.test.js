// test/api.test.js
let expect;

before(async () => {
  const chai = await import('chai');
  expect = chai.expect;
});

const request = require('supertest');
const { listObjects } = require('../index'); // helper function
const express = require('express');
const axios = require('axios');

// Import your app if you export it from index.js
const app = require('../index').app;

describe('API Tests', function () {
  this.timeout(5000);

  it('listObjects() should return an array of objects', async () => {
    const data = await listObjects();
    expect(data).to.be.an('array');
    expect(data.length).to.be.greaterThan(0);
    expect(data[0]).to.have.property('id');
  });

  it('GET /api/objects should return JSON array', async () => {
    const res = await request(app).get('/api/objects');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('id');
  });

  it('GET /api/objects/:id should return single object', async () => {
    const res = await request(app).get('/api/objects/7');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', '7');
    expect(res.body).to.have.property('name');
  });
});