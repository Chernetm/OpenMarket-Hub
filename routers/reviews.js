const express=require('express')
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync')
const{validateReview}=require('../middleware')
const{isLoggedIn,isReviewAuthor}=require('../middleware');
const campground=require('../controllers/reviews')



router.post('/',isLoggedIn,validateReview,catchAsync(campground.createReview))
router.delete('/:reviewId',isReviewAuthor,catchAsync(campground.deleteReview))
module.exports=router;