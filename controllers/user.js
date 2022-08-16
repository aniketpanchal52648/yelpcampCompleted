const User = require('../models/user');
module.exports.renderRegister = (req, res) => {
    res.render('user/register');
}

module.exports.PostUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcom!!!');
            res.redirect('/campgrounds');
        })
        // console.log(registeredUser);



    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.userLogin = (req, res) => {
    res.render('user/login');
}

module.exports.postLogin = (req, res) => {
    req.flash('success', 'welcome on login');
    const redirectUrl = req.session.returnTo || '/campgrounds';

    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            req.flash('error', 'something went wrong');
            return res.redirect('/login');

        }


        req.flash('success', 'Goodbye!!');
        res.redirect('/campgrounds');
    });

}