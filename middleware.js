const Review=require('./models/reviewSchema');
const reviewSchema=require('./models/reviewSchema');
module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        // console.log(req.originalUrl)
        req.flash('error','you must logined');
       return  res.redirect('/login');
    }
    next();
}
module.exports.isReviewAuthor= async(req,res,next)=>{
  
        const {id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review.author.equals(req.user._id)) {
            req.flash('error', 'You do not own that review');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
    
}

module.exports.validateReview=(req,res,next)=>{
    // console.log(req.body.review);
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}