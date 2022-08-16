const Campground = require('../models/campground');
const Review=require('../models/reviewSchema');
module.exports.postReview=async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    // console.log(req.body.review);
    const review= new Review(req.body.review);
    review.author=req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    console.log(review);
    req.flash('success','made a review');
    res.redirect(`/campgrounds/${camp._id}`);
        // console.log("sent")
        // res.send('post')
}

module.exports.deleteReview=async(req,res)=>{    
    const {id,reviewId}= req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','deleted a review');
    res.redirect(`/campgrounds/${id}`);
    // res.send('Deleted');

}