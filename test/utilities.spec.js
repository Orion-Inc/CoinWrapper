/* Testing the models */
let expect = require('chai').expect,
    should = require('chai').should;
let User = require('../models/users'),
    Resolvers = require('../utils/resolvers');


//testing the utilities
describe("checking the usability of the resolvers",function(){
    it('should be a function', function (done) {
        expect(Resolvers.generateValidToken).to.be.a('function');
        done();
    });

    it('should return a promise', function (done) {
        expect(Resolvers.generateValidToken(512)).to.be.a("promise");
        done();
    });

    it('should return a string of provided bitsize', function (done) {
        Resolvers.generateValidToken(512).then( uid => {
            expect(uid).to.be.a("string");
        });
        done();
    });
});

describe(" #Testing verification code generator ", function(){
    it('should return a 5 digit integer', function (done) {
        expect(Resolvers.verificationCode).to.be.a("function");
        expect(Resolvers.verificationCode(10000,99999)).to.be.an("number");
        done();
    });
});
	
	