
// express
const express = require('express');

// create new router
const router = express.Router();

// for user related routes
router.use('/',require('./user'));
// for routes related to admin
router.use('/dashboard/admin',require('./admin'));
// for routes related to employee
router.use('/dashboard/employee',require('./employee'));

// export the router
module.exports = router;