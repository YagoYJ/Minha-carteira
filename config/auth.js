const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/User");
const User = mongoose.model("users");

module.exports = function(passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "email_user",
        passwordField: "password_user"
      },
      (email_user, password_user, done) => {
        User.findOne({ email_user: email_user }).then(user => {
          if (!user) {
            return done(null, false, { message: "Esta conta não existe" });
          } else {
            bcrypt.compare(
              password_user,
              user.password_user,
              (error, check) => {
                if (check) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: "Senha incorreta" });
                }
              }
            );
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
