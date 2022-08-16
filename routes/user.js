const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');

const passport = require('passport');
const user=require('../controllers/user');

router.get('/register',user.renderRegister);

router.post('/register', catchAsync( user.PostUser))

router.get('/login', user.userLogin);

router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.postLogin)

router.get('/logout', user.Logout);

module.exports=router;