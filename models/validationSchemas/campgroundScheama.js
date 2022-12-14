const { number } = require('joi');
const Joi=require('joi');
 module.exports.campgroundSchema= Joi.object({
    title:Joi.string().required(),
  
    price:Joi.number().min(0).required(),
    description:Joi.string().required(),
    location:Joi.string().required()


});

// module.exports=campgroundSchema;
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        body:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
})