// // require passport
// const passport = require('passport');
// // storing strategy used for authentication
// const LocalStrategy = require('passport-local').Strategy;

// const User = require('../models/user');

// // authentication using passport
// passport.use(new LocalStrategy({
//         usernameField: 'email'
//     },
//     async function(email, password, done) {
//         // find a user and establish the identity
//         let user = await User.findOne({ email: email });
//         if (!user || user.password != password) {
//             console.log('Invalid username/password');
//             return done(null, false);
//         }
//         return done(null, user);
//     }
// ));

// // serializing the user to decide which key is to be kept in the cookies
// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });

// // deserializing the user from the key in the cookies
// passport.deserializeUser(async function(id, done) {
//     let userId = await User.findById(id);
//     if (!userId) {
//         console.log("Error in passport_local/deserializeUser");
//         return done(null, false);
//     }
//     return done(null, userId);
// });

// // Checking authentication
// passport.checkAuthentication = function(req, res, next) {
//     // if user is signed in , then pass on the request ot the next fucntion (controller's action)
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     // if the user is not signed in
//     return res.redirect('/users/sign-in');
// }

// // Setting authentication
// passport.setAuthenticatedUser = function(req, res, next) {
//     if (req.isAuthenticated()) {
//         // sending current signed in user to the locals for views
//         res.locals.user = req.user
//     }
//     next();
// }

// // checking whether the logged in user is admin or not
// passport.isAdmin = function(req,res,next){
//     if(req.user.role === 'Admin'){
//         return next();
//     }
//     return res.redirect('back');
// }


// // checking whether the logged in user is an employee
// passport.isEmployee = function(req,res,next){
//     if(req.user.role === 'Employee'){
//         return next();
//     }
//     return res.redirect('back');
// }


// module.exports = passport;




//2nd version using bcryptjs


// import passport 
const passport = require('passport');

// import passport strategy
const LocalStrategy = require('passport-local').Strategy;

// for encrypting password
const bcrypt = require('bcryptjs');

// user model for database
const User = require('../models/user');


// creating new Local Strategy
passport.use(new LocalStrategy(
    // reading username as email
    {
        usernameField:'email'
    },
    // callback function
    async (email, password, done) => {

        // finding user with email in side the database
        const user = await User.findOne({ email: email })
        
        // if user found
        if(user){
            // compare user's password with password in database
            const found = await bcrypt.compare(password, user.password);
            
            // if password doesn't match
            if (!found) {
                // return with message
                return done(null, false, { message: 'Incorrect password.' });
            }


            // if password matches continue
            return done(null, user);
        }

        // if user not found
        else{
            // return with message
            return done(null, false, { message: 'Incorrect username.' });
        }

    }
));



// storing the user information in the session
passport.serializeUser(function(user, done){
    return done(null, user.id);
})


// retrieving user information from the session
passport.deserializeUser(async function(id, done){
    // find user
    const user = await User.findById(id);
    // if no user found
    if (!user) {
        return done(new Error('User not found'));
    }
    // if found 
    return done(null, user); // Retrieve the user based on the stored ID
    
})



// check whether the user is authenticated or not
passport.checkAuthentication =  function(req,res,next){
    // check if user is signed in or not
    // if user is signed in then pass the request to the next function / action in controller
    if(req.isAuthenticated()){
        return next();
    }

    // if user is not signed in 
    return res.redirect('/');
}


// sending user data to local for view
passport.setAuthenticatedUser = function(req,res,next){
    // check if user is signed in or not
    // if user is signed in then sending current signed in user's data (req.user) to locals for views (res.local.user)
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }

    return next();
}


// checking whether the logged in user is admin or not
passport.isAdmin = function(req,res,next){
    if(req.user.role === 'Admin'){
        return next();
    }
    return res.redirect('back');
}


// checking whether the logged in user is an employee
passport.isEmployee = function(req,res,next){
    if(req.user.role === 'Employee'){
        return next();
    }
    return res.redirect('back');
}


// exporting passport for outside use
module.exports = passport;