
// express
const express = require('express');

// create new router
const router = express.Router();

// passport for authentication
const passport = require('passport');


// controller 
const userController = require('../controllers/userController');


// to render homepage / signin page
router.get('/', userController.home);

// to render the sign up page
router.get('/sign-up',userController.signUp);

// for signing out a user 
router.get('/signout',userController.signout);

// for signin a user / creating session
router.post('/create-session', 
    // using passport for authentication
    passport.authenticate(
        // strategy
        'local',
        // if signing in fails
        {failureRedirect:'/'}),

    // controller
    userController.createSession);

// creating a new user
router.post('/create-account',userController.createAccount);

// export the router
module.exports = router;