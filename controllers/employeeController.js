// user's model 
const User = require('../models/user');

// feedback model
const Feedback = require('../models/Feedback');


// render the employee's dashboard
// also show review assigned and feedback given to the employee
module.exports.employee = async (req,res) => {

    // for all the reviews assign to employee by admin
    let employeeAssignedForReview = [];
    const idOfAssignReview = req.user.reviewAssigned;

    // for all the feedback given to the employee by fellow employee
    let feedbackByOther = [];
    const idofFeedbacks = req.user.feedbackByOthers;


    // getting list of all the assign reviews
    if(idOfAssignReview.length > 0 ){

        for (let index = 0; index < idOfAssignReview.length; index++) {
            
            // find employee who's review is assigned
            let employee = await User.findById(idOfAssignReview[index]);

            if(employee){
                // store the employee in array
                employeeAssignedForReview.push(employee);
            }
            
        }
    }

    // getting list of all the feedbacks given by others
    if(idofFeedbacks.length > 0 ){

        for (let index = 0; index < idofFeedbacks.length; index++) {
            
            // getting feedback given from database { comment and user }
            let feedback = await Feedback.findById(idofFeedbacks[index]).populate('reviewer','name');

            if(feedback){
                // store the feedback in array
                feedbackByOther.push(feedback);
            }
            
        }
    }


    // render the employee page 
    // list of review assign and feedback given by other
    res.render('employee',{
        title:"Employee | Dashboard",
        assignReviews:employeeAssignedForReview,
        feedbacks:feedbackByOther
    });
}


// for giving feedback to an employee
module.exports.addReview = async(req,res) => {
    try {

        // getting data of reviewer, recipient , and the comment(review)
        const recipient = req.query.id;
        const reviewer = req.user._id;
        const {comment} = req.body;

        // create a new feedback in database
        const feedbackId = await Feedback.create({
            comment,
            reviewer,
            recipient
        });

        // find the recipient in database
        const recipientEmployee = await User.findById(recipient);
        // store the new feedback's id in recipient's data
        recipientEmployee.feedbackByOthers.push(feedbackId);
        // save recipient's data
        await recipientEmployee.save();


        // find reviewer
        const reviewerEmployee = await User.findById(reviewer);
        // list of all the review's assigned
        const assignedReviews = reviewerEmployee.reviewAssigned;

        // filter out the recipient's name from list 
        const newAssignedReview = assignedReviews.filter(
                                    (review) => JSON.stringify(review) !== JSON.stringify(recipient)
                                    );
        // save new array of assign reviews
        reviewerEmployee.reviewAssigned = newAssignedReview;
        // save reviewer's data
        await reviewerEmployee.save();

        req.flash('success','Your feedback is added !!!');
        // redirect back 
        return res.redirect('back');

    } catch (error) {

        // if error
        console.log(error);
    }
}