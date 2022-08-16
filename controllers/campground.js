const Campground = require('../models/campground');
const mbxGeoconding = require('@mapbox/mapbox-sdk/services/geocoding');
// const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maxBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeoconding({ accessToken: maxBoxToken });



module.exports.index = async (req, res) => {


  const campgrounds = await Campground.find({});

  res.render('campgrounds/index', { campgrounds });

}
module.exports.renderNewForm = (req, res) => {

  res.render('campgrounds/new');
}

module.exports.postNewcampground = async (req, res) => {
  // console.log(req.body);
  // console.log(req.body.location)
  const geoCode = await geoCoder.forwardGeocode({
    query: req.body.location,
    limit: 1
  }).send();
  // console.log(geoCode.body.features);
  // res.send(geoCode.body.features[0].geometry.coordinates);

  const camp = await Campground(req.body);
  camp.geometry=geoCode.body.features[0].geometry;
  camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  camp.author = req.user._id;
  await camp.save();
  // console.log(camp);
  req.flash('success', 'made a campground');
  res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }

  }).populate('author');


  // console.log(campground.reviews);
  if (!campground) {
    req.flash('error', 'cannot find that campground');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground });
}


module.exports.editCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'cannot find that campground');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground });

}


module.exports.updateCampground = async (req, res) => {

  const campground = await Campground.findOneAndUpdate({ _id: req.params.id }, req.body);
  await campground.save();
  req.flash('success', 'update a campground');
  res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'deleted a campground');
  res.redirect('/campgrounds');
}