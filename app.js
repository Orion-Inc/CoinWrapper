let express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    morgan  = require('morgan'),
    express_session = require('express-session'),
    bodyParser = require('body-parser'),
    jwt  = require('jsonwebtoken'),
    cors = require('cors'),

    config = require('./config'),
    Users = require('./models/users'),
    User_Verification = require('./models/user_verification'),
    tokenNotifier  = require('./utils/nodemailer'),
    Resolvers      = require('./utils/resolvers'),
    coinageRouter = require('./api/coinage-v1');

//Instantiating the express  application
let app = express();

//Setting the basic initials
app.set('title','Task Application API');
app.set('port',process.env.PORT || 8080);
app.set('BASE_URL','localhost:8080/');
app.set('SECRET', config.secret);

mongoose.connect(config.database || process.env.MONGODB_URL); // this is a pending connection
let db = mongoose.connection;
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

app.get('/',function(request,response){
    response.send('Hello! The API is a lit');
});


// Calling the api configs here
app.use(function(req,res,next){
    console.log("Sample middleware");
    next();
});

app.post('/signup',function(req,res){
   let Query = new Users({
       firstname: req.body.firstname,
       othername :  req.body.othername,
       username : req.body.username,
       email  : req.body.email,
       phone :  req.body.phone
   });

  //Check if the user already exists
    Users.findOne({ email: Query.email },function(err, user){
        if (err){
            throw err;
        }

        if (!user){
            Query.save(function(err,results){
                if (!err){
                    // Using jwt instead for the token generation
                    const payload = {
                        user_id: results._id
                    };

                    let uriToken = jwt.sign(payload,app.get('SECRET'),{
                        algorithm: 'HS256',
                        expiresIn: '300s'
                    });

                    // A four digit verification token
                    let genToken = Resolvers.verificationCode(10000,99999);

                    let Verification = new User_Verification({
                        token: genToken,
                        user_id: results._id
                    });

                    Verification.save(function(err,data){
                        if (!err){
                            const fullname = results.firstname + "  " + results.othername;
                            tokenNotifier('lordkay1996@gmail.com',results.email,fullname,uriToken);

                            res.status(201).json({
                                message: "User Profile Successfully Created\n An Email has been sent to your "+ results.email + " .",
                                success: true
                            });
                        }else{
                            res.status(401)
                                .json({
                                    message: 'An error occurred while saving access token',
                                    success: false
                                });
                        }
                    });
                }else {
                    console.log(err);
                    res.status(401)
                        .json({
                            message: 'An error occurred while saving to user data',
                            success: false
                        });
                }
            })
        } else if(user){
            res.status(401).json({
                message: 'User already Exists',
                success: false
            })
        }
    })

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
app.use('/api/v1',coinageRouter);

http.createServer(app).listen(app.get('port'),function(){
    console.log("The server started at port " + app.get('port'));
});

