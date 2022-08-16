const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');


const {isLoggedIn,isReviewAuthor,validateReview}=require('../middleware');
const review=require('../controllers/review');




router.post('/', isLoggedIn,validateReview,catchAsync(review.postReview));

router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync( review.deleteReview));

module.exports=router;