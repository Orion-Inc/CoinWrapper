require("module-alias/register");
const Users = require('@models/users/users'),
    User_Verification = require('@models/users/user_verification'),
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

    it('should return a null value ', function (done) {
       let findUser =  Users.findOne({ email : 'offeilord@gmail.com'});
       findUser.exec(function(err,user){
          expect(user).to.be.an('object');
       });
       done();
    });

});