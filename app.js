if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}

const { urlencoded } = require('express');
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const passportLocal=require('passport-local');
const User=require('./models/user');
const multer=require('multer');
const {storage}=require('./cloudanary/index');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const MongoDBS=require('connect-mongo');



app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
// const dburl=process.env.MONGO_ATLAS;
const dburl=process.env.MONGO_ATLAS  || 'mongodb://localhost:27017/yelp-camp';
const secret=process.env.SECREAT;
mongoose.connect(dburl)
.then( ()=>{
    console.log('connected');

})
.catch((err)=>{
    console.log('error');
    console.log(err);
});




const store=new MongoDBS({
    mongoUrl:dburl,
    secret,
    touchAfter:24*60*60
})
store.on('error', function(e){
    console.log('session store error');
})
const sessionConfig={
    store:store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
//how to store and unstore user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static('public'))

app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})





const campgroundRoute=require('./routes/campgrounds');
const reviewRoute=require('./routes/review');
const userRoutes=require('./routes/user');










app.use('/campgrounds',campgroundRoute);
app.use('/campgrounds/:id/review',reviewRoute);
app.use('/',userRoutes)


app.get('/',(req,res)=>{
    res.render('campgrounds/home');
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Something went wrong';
    res.status(statusCode).render('error' , {err});
})
const port=process.env.PORT|| 3000;
app.listen(port,()=>{
    console.log(`Serving on port${port}`);
})