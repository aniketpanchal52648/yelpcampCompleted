const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../models/validationSchemas/campgroundScheama');
const { isLoggedIn } = require('../middleware');
const campground = require('../controllers/campground');
const multer=require('multer');
const {storage}=require('../cloudanary/index');
const upload=multer({storage});

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not own that campgrounds');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


const validateCampground = (req, res, next) => {
    // console.log(campgroundSchema);
    const { error } = campgroundSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(error);

        throw new ExpressError(msg, 400);
    } else {
        next();
    }

}

router.get('/', catchAsync(campground.index));

router.get('/new', isLoggedIn, campground.renderNewForm);
// router.post( '/',upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files);
//     res.send("worked!!!");
// })

router.post('/', isLoggedIn, upload.array('images'),validateCampground, catchAsync(campground.postNewcampground))

router.get('/:id', catchAsync(campground.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editCampground));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campground.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

module.exports = router;