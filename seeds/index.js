// console.log('here');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelper');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('connected');

    })
    .catch((err) => {
        console.log('error');
        console.log(err);
    });
const sample = arr => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: '62f5fc758f290c8bcffdce98',
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/aniket52648/image/upload/v1660554799/YelpCamp/axvy0r2bdvz3gusvltgz.avif',
                    filename: 'YelpCamp/axvy0r2bdvz3gusvltgz',

                },
                {
                    url: 'https://res.cloudinary.com/aniket52648/image/upload/v1660554799/YelpCamp/b6adkq2rulosfkblbw3o.avif',
                    filename: 'YelpCamp/b6adkq2rulosfkblbw3o',

                },
                {
                    url: 'https://res.cloudinary.com/aniket52648/image/upload/v1660554798/YelpCamp/wb5u8s6vkt5ksem5cudg.avif',
                    filename: 'YelpCamp/wb5u8s6vkt5ksem5cudg',

                }
            ],
            description: '  Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt quae laboriosam minus ipsa ducimus sed quasi? Sed explicabo perspiciatis in, totam pariatur repudiandae nam eaque eos tenetur magni exercitationem tempora.'


        })
        await camp.save();
    }

}
seedDB().then(() => {
    mongoose.connection.close();
})