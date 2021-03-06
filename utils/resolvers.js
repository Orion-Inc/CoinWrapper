//requiring the necessary modules
var bcrypt = require('bcryptjs'),
    SALT_FACTOR = 10,
	TokenGenerator = require('uid-generator');

module.exports = {
    generateHash: function(password) {
        return new Promise( (resolve, reject) => {
            if(password != "") {
                bcrypt.genSalt(SALT_FACTOR,(err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) {
                            reject(err)
                        } else { resolve(hash) }
                    })
                })
            }
        });
    },
    comparePassword: function(password, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, results) => {
                if(err) { reject(err) }
                else { resolve(results) }
            })
        });
    },
	generateValidToken: function(bitSize, encoding=TokenGenerator.BASE62){
	    return new Promise( (resolve,reject) => {
	       if (!isNaN(bitSize)){
               const genToken = new TokenGenerator(bitSize,encoding);
               genToken.generate().then( uid => {
                   resolve(uid);
               });
           } else{
	           reject(bitSize);
	           return "bitSize must be a number";
           }
        });

	},
    verificationCode: function(min,max){
	    if (isNaN(min) && isNaN(max))
        {
            return "Must be a number please";
        }else{
	        return Math.floor((Math.random() + (max - min)) + min);
        }
    },
    verificationEmail: function(email){
	    return  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
    },
    formatString: function(transform, input="email"){
        if (transform === 'U' || transform === 'u') {
            return input.toUpperCase();
        } else if (transform === 'L' || transform === 'l') {
            return input.toLowerCase();
        } else if (transform === 'C' || transform === 'c') {
            return input.charAt(0).toUpperCase() + input.slice(1);
        } else {
            return input.toUpperCase();
        }
    },
    generateUUID: function() {
        
    }
};