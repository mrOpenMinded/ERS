// for environment variables
// require('dotenv').config();

// connect to database


// express
const express = require('express');
const port=7000;
const app=express();
const path=require('path');

// importing layouts 
const expressLayouts =  require('express-ejs-layouts');

// for parsing the data in cookie
const cookieParser = require('cookie-parser');

const db=require('./config/mongoose');

// flash messages package and middleware
const flash = require('connect-flash');
const myMware=require('./config/middleware');

// store the session create by passport
const session=require('express-session');
// passport
const passport = require('passport');
// passport local strategy
const passportConfig = require('./config/passport_local');
// store the session in mongostore
const MongoStore = require('connect-mongo');
// using layouts
app.use(expressLayouts);

// for reading json data
app.use(express.json());
// for reading url data
app.use(express.urlencoded({
    extended:true
})); 


// for parsing the cookies
app.use(cookieParser());

// extracting stylesheets and scripts for individual pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// setting view engine as ejs and defining its path
app.set('view engine','ejs');
app.set('views','./views');

// for static files folder
app.use(express.static(path.join(__dirname,'assets')));


//mongo store is used to store the session cookie
app.use(session({
    name: 'Employee_Review_System',
    secret: "iLoveYou",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://maapaa1073:NglDU4QWWJ2Wp012@cluster0.aei2dmf.mongodb.net/?retryWrites=true&w=majority",
            // mongoUrl: process.env.MONGODB_URI,//change 1-31/10
            autoRemover: 'disabled'
        },
        function(err) {
            console.log("Error in the mongo-store");
        }
    ),
}));


// initialize passport
app.use(passport.initialize());
// passport sessions
app.use(passport.session());

// store the logged in user's data in locals variable
app.use(passport.setAuthenticatedUser);

// connect-flash middleware
app.use(flash());
app.use(myMware.setFlash);

// routes
app.use('/',require('./routes'));

// directing the app in the given port
app.listen(port, function(err) {
    if (err) {
        console.log('Error', err);
        return;
    }
    console.log('Server is up and running on port: ', port);

});


  





