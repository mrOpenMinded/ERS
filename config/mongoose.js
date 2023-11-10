//require the library
const mongoose = require('mongoose');

//connect to the database
// 'mongodb://127.0.0.1:27017/habit_tracker'
mongoose.connect("mongodb+srv://maapaa1073:NglDU4QWWJ2Wp012@cluster0.aei2dmf.mongodb.net/?retryWrites=true&w=majority");//change 2-=31/10
//use process.env.MONGODB_URI for deploy

//acquire the connection(to check if it's successful)
const db = mongoose.connection;

//error
db.on('error', console.error.bind(console,"error connecting to db") );

//up and running then print the message
db.once('open', function() {
  
    console.log("Successfully connected to the database");

});

module.exports=db;


// NglDU4QWWJ2Wp012

// MONGODB_URI------mongodb+srv://maapaa1073:NglDU4QWWJ2Wp012@cluster0.aei2dmf.mongodb.net/?retryWrites=true&w=majority

// render for backend and mongodb atlas instead of compass