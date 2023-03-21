const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../model/user");
module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "userName" },
      (userName, password, done) => {
        //Match user
        User.findOne({ username: userName })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "This username is not registed",
              });
            }
            //Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password is incorrect" });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );
  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });

  // passport.deserializeUser((id, done) => {
  //   User.findById(id, (error, user) => {
  //     done(error, user);
  //   });
  // });
  passport.serializeUser((user, done) => {
    done(null, { id: user.id, name: user.name, role: user.isAdmin === true ? "admin" : "user" });
  });
  
  passport.deserializeUser((data, done) => {
    User.findById(data.id, (error, user) => {
      if (error) {
        return done(error);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, {
        id: user.id,
        name: user.name,
        role: data.role
      });
    });
  });
};

// passport.use(new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'password'
// }, (username, password, done) => {
//     User.findOne({ username: userName})
// .then(user =>{
// 	if(!user){
// 		return done(null, false, {message: 'This username is not registed'});
// 	}
// 	//Match password
// 	bcrypt.compare(password, user.password, (err, isMatch)=>{
// 		if(err) throw err;
// 		if(isMatch){
// 			return done(null, user);
// 		}
// 		else{
// 			return done(null, false, {message: 'Password is incorrect'});
// 		}
// 	})
// })
// }));

// const jwtOptions = {
//     secretOrKey: 'your_secret_key',
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// };

// passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
//   const user = users.find(u => u.id === payload.id);
//   if (!user) {
//     return done(null, false);
//   }
//   return done(null, user);
// }));
