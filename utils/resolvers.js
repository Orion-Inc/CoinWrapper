//requiring the necessary modules
var bcrypt = require('bcryptjs'),
	TokenGenerator = require('uuid-token-generator');

module.exports = {
	generateValidToken: function(bitSize, encoding=TokenGenerator.BASE62){
		const genToken = new TokenGenerator(bitSize,encoding);
		return genToken.generate();
	},
    verificationCode: function(min,max){
	    if (isNaN(min) && isNaN(max))
        {
            return "Must be a number please";
        }else{
	        return Math.floor((Math.random() + (max - min)) + min);
        }
    }
};