var LocalStrategy = require('passport-local');
var md5 = require('md5');
var usersModel = require(__path_models + 'users');
var notify = require(__path_configs + 'notify');



module.exports = (passport) => {
    passport.use(new LocalStrategy(
        function (username, password, done) {
          usersModel.getByUsername(username).then((users) => {
            let user = users[0];
            if (!user) { 
              return done(null, false,{ message: 'Tên user không đúng' }); 
            } else {
              if (md5(password) != user.password) { 
                return done(null, false,{ message: 'Mật khẩu không đúng' }); 
              } else {
                console.log('dang nhap thanh cong');
                return done(null, user);
              }
            }
          })
        }
      ));
      
      passport.serializeUser(function(user, done) {
        done(null, user._id);
      });
      
      passport.deserializeUser(function(id, done) {
        usersModel.getItems(id).then((user)=>{
          done(null, user);
        })
      });
}