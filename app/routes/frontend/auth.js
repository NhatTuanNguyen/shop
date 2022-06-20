var express = require('express');

var router = express.Router();
var passport = require('passport');

var usersModel = require(__path_models + 'users');
const validatorLogin = require(__path_validators + 'login');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/`;
let linkLogin = `/auth/login`;
const folderView = __path_views_frontend + 'pages/auth/';
const layoutfrontend = __path_views_frontend + 'frontend';

/* Gett logout page */
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect(linkLogin)
});

/* Gett login page */
router.get('/login', (req, res, next) => {
  if (req.isAuthenticated()) res.redirect(linkIndex);
  let item = { email: '', password: '' };
  let errors = null;
  res.render(`${folderView}login`, { layout: layoutfrontend, errors,item });
});

/* Gett logout page */
router.post('/login',
  (req, res, next) => {
    validatorLogin.validator(req);
    let item = req.body;
    let errors = req.validationErrors();
    if (errors) {
      res.render(`${folderView}login`, { layout: layoutfrontend, errors, item })
    } else {
      passport.authenticate('local',{ failureRedirect: linkLogin,successRedirect: req.session.returnTo || `/`,failureMessage: true})(req, res, next);
    }
});

router.get('/no-permission', (req, res, next) => {
  res.render(`${folderView}no-permission`,{layout: layoutLogin});
});

// SignUp
router.post('/signup', (req, res, next) => {
  item = req.body;
  usersModel.saveItems(item, 'signup').then(() => {
    req.flash('success', notify.ADD_SIGNUP, false);
    res.redirect(linkLogin);
  }).catch(err => {
    req.flash('danger', notify.ERROR_SAME_EMAIL, false);
    res.redirect(linkLogin);
  });
})

module.exports = router;