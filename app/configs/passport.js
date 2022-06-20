var LocalStrategy = require('passport-local');
var md5 = require('md5');
var usersModel = require(__path_models + 'users');
var notify = require(__path_configs + 'notify');



module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passswordField: 'password',
    passReqToCallback: true
  }, function (req,email, password, done) {
    usersModel.getByEmail(email).then((users) => {
      let user = users[0];
      if (!user) {
        req.flash('danger', 'Email is not correct', false);
        return done(null, false, { message: 'Tên user không đúng' });
      } else {
        if (md5(password) != user.password) {
        req.flash('danger', 'Password is not correct', false);
          return done(null, false, { message: 'Mật khẩu không đúng' });
        } else {
          console.log('dang nhap thanh cong');
          if(req.session.returnTo) delete req.session.returnTo;
          return done(null, user);
        }
      }
    })
  }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    usersModel.getItems(id).then((user) => {
      done(null, user);
    })
  });
}