var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    morgan  = require('morgan'),
    express_session = require('express-session'),
    bodyParser = require('body-parser'),
    jwt  = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    cors = require('cors'),
    nodemailer = require('nodemailer'),
    config = require('./config'),
    tokenNotifier  = require('./utils/nodemailer'),
    Resolvers      = require('./utils/resolvers');

//Instantiating the express  application
var app = express();

//Setting the basic initials
app.set('title','Task Application API');
app.set('port',process.env.PORT || 8080);

mongoose.connect(config.database); // this is a pending connection
var db = mongoose.connection;
db.on('error',console.error.bind(console," Connection Error "));
db.once('open',function(){
    console.log("Connection established");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//Activating the morgan logger
app.use(morgan('dev'))
app.use(function(request,response,next){
    console.log("Middleware for starter");
    next()
});

app.get('/',function(request,response,next){
    response.send('Hello! The API is a lit');
});


// Calling the api configs here

http.createServer(app).listen(app.get('port'),function(){
    console.log("The server started at port " + app.get('port'));
});

