/* Testing the models */
require("module-alias/register");
let expect = require('chai').expect,
    should = require('chai').should;
let User = require('@models/users/users'),
    Resolvers = require('@utils/resolvers'),
    tokenNotifier = require("@utils/nodemailer");


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

    it('should return transformed letters', function (done) {
        expect(Resolvers.formatString('u','lord')).to.equal('LORD');
        expect(Resolvers.formatString('l','LORD')).to.equal('lord');
        expect(Resolvers.formatString('c','lord')).to.equal('Lord');
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

describe(" #Testing the validation of email " ,function () {
    it('should return a boolean value', function (done) {
        expect(Resolvers.verificationEmail).to.be.a("function");
        expect(Resolvers.verificationEmail("offeilord@gmail.com")).to.be.true;
        done();
    });
});

describe(" #Testing the email utility ",function(){
    it('should send an email to the provided address', function (done) {
        let email = tokenNotifier('orionghana.io@gmail.com', 'offeilord@gmail.com', 'Lord Acheampong', 'siofidfosifosfsdf', "Signing In");
        console.log(email);
        done();
    });
})
	