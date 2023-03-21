const redirectLogin = (req, res, next) => {  
    console.log(req.user);
        if (req.user && req.user.role === "admin") {
            req.flash('success_msg',"Login successfull")
            res.redirect('/players');
        } else {
          req.flash('success_msg',"Login successfull")
          res.redirect('/');
        }
      };
  module.exports = {redirectLogin}