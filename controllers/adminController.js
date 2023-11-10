// user's model (database)
const User = require('../models/user');

// feedback's model (database)
const Feedback = require('../models/Feedback');

// for password encryption
const bcrypt = require('bcryptjs');


//  render the admin's dashboard page
module.exports.admin = async (req,res) => {
    try {

        // getting list of all the user with role as 'Employee'
        const employeeList = await User.find({role:'Employee'});
        
        // render the admin's page with list of employee
        res.render('admin',{
            title:"Admin | Dashboard ",
            employee:employeeList
        });

    } catch (error) {
        // ir error
        console.log(error);
    }
}


// to delete an employee from database
module.exports.deleteEmployee = async (req,res) => {
    try { 
        // getting employee's id from query  
        const id = req.query.id;

        // delete all the reviews given by this user
        await Feedback.deleteMany({reviewer: id});

        // delete all the reviews given to this user
        await Feedback.deleteMany({recipient: id});

        // find the employee by id and delete
        await User.findByIdAndDelete(id);

        req.flash('success','Employee successfully deleted');
        // redirect to last page
        return res.redirect('back');
    } catch (error) {
        // if error
        console.log(error);
    }
}


// route for rendering the update data form
module.exports.updateForm =  async(req,res) => {

    // getting user's id from query ( which is to be updated )
    const employee = await User.findById(req.query.id);

    // empty array of feedbacks
    let feedbackByOther = [];

    // getting array to feedbacks given to employee by fellow employees
    const idofFeedbacks = employee.feedbackByOthers;

    // if the array contains some data
    if(idofFeedbacks.length > 0 ){

        // map over the array
        for (let index = 0; index < idofFeedbacks.length; index++) {
            
            // get the feedback from 'Feedback' model based on id stored in employee's data
            let feedback = await Feedback.findById(idofFeedbacks[index]).populate('reviewer','name');

            // store the feedback in array
            if(feedback){
                feedbackByOther.push(feedback);
            }
            
        }
    }

    // render the update form
    // pass the list of feedback given to employee by others
    res.render('updateForm',{
        title:"Admin | Update Employee ",
        employee:employee,
        feedbacks:feedbackByOther
    });
}


// update employees data
module.exports.updateEmployee = async(req,res) => {

    // find the user by id and update data
    await User.findByIdAndUpdate(req.query.id, req.body);

    req.flash('success','Info Updated !!');
    // redirect to dashboard
    res.redirect('/dashboard/admin');
}


// to render the form for adding a new employee
module.exports.addEmployeeForm =  (req,res) => {
    
    // render the form on screen
    res.render('addEmployee',{
        title:"Admin | Add Employee ",
    });
}


// route for adding employee
module.exports.addEmployee = async(req,res,next) => {
    try {

        // getting new employee's data
        const {name,email,password,cnf_password} = req.body;
        // define the role for new employee
        const role = 'Employee';    

        // check whether there is already an employee with similar email address
        const userExist = await User.findOne({email});

        // if no employee found
        if(!userExist){

            // match password and confirm password
            // if not match
            if(password !== cnf_password ){
                
                req.flash('error','Password does not match !!');
                // return back
                return res.redirect('back');
            }
            
            // if password match
            // encrypt the password
            const cryptPassword = await bcrypt.hash(password, 10);
            

            // creating a new user with data
            const user = await User.create({
                name,
                email,
                role,
                password:cryptPassword,
            })

            req.flash('success','New employee created ');
        }
        else{
            req.flash('error','Email address already exist');
        }

        // return back to dashboard of admin
        return res.redirect('/dashboard/admin');


    } catch (error) {
        // if error
        console.log(error);
    }
}


// router for assign a review to any employee
module.exports.assignReview = async(req,res) => {

    // finding user with id in database ( reviewer )
    const employee = await User.findById(req.query.id);


    // if employee found
    // check whether the user already have the recipient in his assign review list
    if(employee.reviewAssigned.includes(req.body.recipient)){
        req.flash('error','Recipient already assigned to this user');        
        // return back if recipient already exists
        return res.redirect('back');
    }

    // if not already exist
    // add recipient to reviewer's data
    employee.reviewAssigned.push(req.body.recipient);

    // save employee's data
    await employee.save();

    req.flash('success','Review Assigned');
    // redirect back
    res.redirect('back');
}