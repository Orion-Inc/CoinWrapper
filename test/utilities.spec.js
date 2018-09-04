/* Testing the models */
let expect = require('chai').expect,
    should = require('chai').should;
let User = require('../models/users'),
    Resolvers = require('../utils/resolvers'),
    User_Verification = require('../models/user_verification');
let db = require('./utils/db.spec');

//testing the utilities
describe("checking the usability of the resolvers",function(){
    it('should be a function', function () {
        expect(Resolvers.generateValidToken).to.be.a('function');
    });

    it('should return a promise', function () {
        expect(Resolvers.generateValidToken(512)).to.be.a("promise");
    });
});
	
	