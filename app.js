let express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    morgan  = require('morgan'),
    express_session = require('express-session'),
    bodyParser = require('body-parser'),
    jwt  = require('jsonwebtoken'),
    cors = require('cors'),
    config = require('./connection/connectionString'),
    Users = require('./models/users/users'),
    User_Verification = require('./models/users/user_verification'),
    Resolvers      = require('./utils/resolvers'),
    SwapV1 = require('./api/swap-v1');
//Instantiating the express  application
let app = express();

//Setting the basic initials
require("dotenv").config();
app.set('title','Task Application API');
app.set('port',process.env.PORT || 8088);

if(process.env.NODE_ENV === "development") {
    mongoose.connect(process.env.DB_STRING,{
        useNewUrlParser: true
    }); // this is a pending connection
    let db = mongoose.connection;
    db.on('error',console.error.bind(console," Connection Error "));
    db.once('open',function(){
        console.log("Connection established");
    });
    
} else if(process.env.NODE_ENV === "production") {
    mongoose.connect(process.env.CLUSTER_DBSTRING,{
        useNewUrlParser: true
    }); // this is a pending connection
    let db = mongoose.connection;
    db.on('error',console.error.bind(console," Connection Error "));
    db.once('open',function(){
        console.log("Connection established");
    });
    
}
console.log(process.env.NODE_ENV);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//Activating the morgan logger
app.use(morgan('dev'))
app.use(function(request,response,next){
    console.log("Middleware for starter");
    next()
});

app.get('/',function(request,response){
    response.send('Hello! The API is a lit');
});


// Calling the api configs here
app.use(function(req,res,next){
    console.log("Sample middleware");
    next();
});

//Testing end points
app.get('/delete',function(req,res){
    Users.remove().exec(function(err,data){
        res.json({
            result: data
        })
    });
});

app.get('/verification',function(req,res){
    User_Verification.find({}).remove(function(err,data){
        res.json({
            data: data
        })
    })
});

app.get('/all',function(req,res){
    Users.find({}).exec(function(err,results){
        res.json({
            users: results
        })
    })
});

// Api version 1 mount path
app.use('/api/v1',SwapV1);

http.createServer(app).listen(app.get('port'),function(){
    console.log("The server started at port " + app.get('port'));
});

