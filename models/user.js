// import mongoose 
const mongoose = require('mongoose');

// creating user schema
const userSchema = new mongoose.Schema(
    {
        // name of user
        name:{
            type:String,
            required:true
        },
        // email of user
        email:{
            type:String,
            required:true,
            unique:true,
        },
        // password of user
        password:{
            type:String,
            required:true,
        },
        // role between admin and employee
        role:{
            type:String,
            required:true,
        },
        // reviews assigned to user by admin
        reviewAssigned:[
            {   
                // id of user
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        // feedback given to user by other employee
        feedbackByOthers:[
            {
                // id of feedback
                type:mongoose.Schema.Types.ObjectId,
                ref:'Feedback'
            },
        ]
    },
    {
        // timestamp
        timestamps:true,
    }
)

// creating a new model from schema
const User = mongoose.model('User',userSchema);

// export schema
module.exports = User;