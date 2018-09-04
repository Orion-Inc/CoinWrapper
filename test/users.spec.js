const Users = require('../models/users'),
    User_Verification = require('../models/user_verification'),
    expect = require('chai').expect,
    db = require('./utils/db.spec');

describe('#Testing models',function () {
    db();
    it('should all users from user model', function (done) {
        Users.find({},function(err,data){
            expect(data).to.be.a("array");
            expect(data).to.have.lengthOf(0);
        });
        done();
    });

    it('should have to the user model', function (done) {
        let user = new Users({
            firstname: 'Lord ',
            othername: 'Offei',
            username: 'lordkay',
            email:'offeilord@gmail.com',
            phone: '0200746417'
        });

        user.save(function(err,data){
            expect(data).to.be.an("object");
        });
        done();
    });

});