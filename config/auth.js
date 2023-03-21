const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../model/user')
module.exports = {
    //with passport
        ensureAuthenticated: function(req, res, next) {
           if(req.isAuthenticated()){
               return next();
           }
           req.flash('error_msg', 'Please log in first!');
           res.redirect('/users/login');
        },
        //with jwt
        jwtAuth: (req, res, next) => {
         const token = req.cookies.jwt;
         if (!token) {
            console.log("error token");
           req.flash('error_msg', 'Please log in first!');
           return res.redirect('/users/login');
         }
         jwt.verify(token, 'my_secret_key', (err, decoded) => {
           if (err) {
            if(err.message === "jwt expired"){          
             const data = jwt.decode(token)
             const new_token = jwt.sign(
              {
                user: {
                  userId: data.user.userId,
                  name: data.user.name,
                  role: data.user.role,
                },
              },
              "my_secret_key",
              {
                expiresIn: "30m",
              }
            );
            res.clearCookie("jwt");
            res.cookie("jwt", new_token, {
              httpOnly: true,
              secure: true,
              maxAge: 24 * 60 * 60 * 1000,
            });
            req.userId = data.user.userId;
            req.name = data.user.name;
            req.role = data.user.role;
            next();
            }
            else{
              req.flash('error_msg', err.message);
              return res.redirect('/users/login');
             }            
           }else{
           req.userId = decoded.user.userId;
           req.name = decoded.user.name;
           req.role = decoded.user.role;
           next();
           }      
         });
       } 
    }