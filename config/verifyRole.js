const requireRole = (req, res, next) => {  
      if (req.role && req.role === "admin") {
        next();
      } else {
        req.flash('error_msg',"Access denied, your role is not admin")
        res.redirect('/');
      }
    };
module.exports = {requireRole}