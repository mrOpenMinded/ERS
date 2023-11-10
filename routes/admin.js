
// import express
const express = require('express');

// creating router
const router = express.Router();

// passport for authentication
const passport = require('passport');

// controller
const adminController = require('../controllers/adminController');


// to render the dashboard
router.get('/',
            // to check whether user is logged in or not
            passport.checkAuthentication,
            // to check whether the user is admin or not
            passport.isAdmin,
            // controller for route
            adminController.admin);


// to delete an employee
router.get('/delete/',
            // to check whether user is logged in or not
            passport.checkAuthentication,
            // to check whether the user is admin or not
            passport.isAdmin,
            // controller for route
            adminController.deleteEmployee);


// to render the update form
router.get('/updateForm',
            // to check whether user is logged in or not
            passport.checkAuthentication,
            // to check whether the user is admin or not
            passport.isAdmin,
            // controller for route
            adminController.updateForm);


// to update an employee's data
router.post('/update',
            // to check whether user is logged in or not
            passport.checkAuthentication,
            // to check whether the user is admin or not
            passport.isAdmin,
            // controller for route
            adminController.updateEmployee);


// to render add employee form
router.get('/addEmployee',
            // to check whether user is logged in or not
            passport.checkAuthentication,
            // to check whether the user is admin or not
            passport.isAdmin,
            // controller for route
            adminController.addEmployeeForm);

            
// for creating a new user by admin
router.post('/createEmployee',
            // to check whether user is logged in or not
            passport.checkAuthentication,
            // to check whether the user is admin or not
            passport.isAdmin,
            // controller for route
            adminController.addEmployee);

            
// assign review to an employee
router.post('/assignReview',
            // to check whether user is logged in or not
            passport.checkAuthentication,
            // to check whether the user is admin or not
            passport.isAdmin,
            // controller for route
            adminController.assignReview);


// export router
module.exports = router;