module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()){
            return next()
        }else{
            req.flash('error_msg', 'Accés non Autorisé');
            res.redirect('/login');
        }
    }
}