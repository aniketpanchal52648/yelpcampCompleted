const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('../models/reviewSchema');
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
        title: String,
        images: [
                {
                        url: String,
                        filename: String
                }
        ],

        price: Number,
        description: String,
        location:String,
        geometry: {
                type: {
                  type: String, // Don't do `{ location: { type: String } }`
                  enum: ['Point'], // 'location.type' must be 'Point'
                  required: true
                },
                coordinates: {
                  type: [Number],
                  required: true
                }
              },
        author: {
                type: Schema.Types.ObjectId,
                ref: 'User'
        },
        reviews: [
                {
                        type: Schema.Types.ObjectId,
                        ref: 'Review'

                }
        ]
},opts);

CampgroundSchema.virtual('properties.popM').get(function() {
        return `<a href="/campgrounds/${this._id}">${this.title} </a>`;
      });
CampgroundSchema.post('findOneAndDelete', async function (doc) {
        if (doc) {
                await Review.remove({
                        _id: {
                                $in: doc.reviews
                        }
                })
        }
})
module.exports = mongoose.model('Campground', CampgroundSchema);