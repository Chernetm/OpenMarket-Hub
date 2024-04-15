const {campgroundSchema,reviewSchema}=require('./schemas');
const AppError=require('./utils/AppError');
const campground=require('./models/campground');
const Review=require('./models/review')



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
    //const { error } = campgroundSchema.validate(req.body);
    const { error } = campgroundSchema.validate(req.body, {
        allowUnknown: true // Allow unknown fields to pass validation
    })
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
    
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const camp = await campground.findById(id);
        if (!camp) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds'); // Redirect to a suitable URL
        }
        if (!camp.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    } catch (err) {
        console.error('Error in isAuthor middleware:', err);
        req.flash('error', 'Something went wrong');
        res.redirect('/campgrounds'); // Redirect to a suitable URL
    }
};





// module.exports.isAuthor = async (req,res,next)=>{
//     const{id}=req.params;
//     const camp= await campground.findById(id);
//     if(!camp.author.equals(req.user._id)){
//         req.flash('error','You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }
module.exports.isReviewAuthor = async (req,res,next)=>{
    const{id,reviewId}=req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateReview=(req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
    
}