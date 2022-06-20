let linkLogin = `/auth/login`;
let linkNoPermission = `/auth/no-permission`;

module.exports = (req, res,next) => {
  // console.log(req.isAuthenticated(),req.user);
  if(req.isAuthenticated()) {
      if(req.user.group.name == 'admin') {
          next();
      } else {
          res.redirect('/');
      }
  } else {
      res.redirect(linkLogin);
  }
}