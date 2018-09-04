const express = require("express"),
    request = require("supertest"),
    expect = require("chai").expect,
    app = require("../app");

    //testing the app js file
describe('#Testing the express app itself', function () {
    it('should display the running port', function (done) {
        request(app)
            .get('/all')
            .expect('Content-Type',/json/)
            .expect(200,done);
    });
});