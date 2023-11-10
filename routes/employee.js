
// import express
const express = require('express');

// create new router
const router = express.Router();

// passport for authentication
const passport = require('passport');

// controller
const employeeController = require('../controllers/employeeController');


// to render the dashboard for an employee
router.get('/',
            // check whether the user is logged in not
            passport.checkAuthentication,
            // to check whether the logged in user is employee or not
            passport.isEmployee,
            // controller
            employeeController.employee);


// for giving feedback to a fellow employee
router.post('/addReview',
            // check whether the user is logged in or not
            passport.checkAuthentication,
            // check whether logged in user is an employee or not
            passport.isEmployee,
            // controller
            employeeController.addReview);


// export the router 
module.exports = router;