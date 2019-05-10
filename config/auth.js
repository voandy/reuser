// custom passport middleware to be attached to any route to ensure only 
// authenticated users are allowed to access it
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/login');
    }
}