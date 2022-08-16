const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalM=require('passport-local-mongoose');

const userScheama=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
        
    }
});
userScheama.plugin(passportLocalM);
module.exports=mongoose.model('User',userScheama);