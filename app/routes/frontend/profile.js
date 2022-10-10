var express = require('express');
var router = express.Router();
var usersModel = require(__path_models + 'users');
var notify = require(__path_configs + 'notify');
const paramsHelper = require(__path_helpers + 'params');

const layoutfrontend = __path_views_frontend + 'frontend';
const folderView = __path_views_frontend + 'pages/profile/';
const linkIndex = '/profile';
const middleAuthentication = require(__path_middleware + 'auth');


/* GET home page. */
router.get('/',middleAuthentication, function (req, res, next) {
 
  res.render(`${folderView}index`, {
    layout: layoutfrontend,
  });
});

router.post('/', async function (req, res, next) {
  item = req.body;
  usersModel.saveItems(item,'profile').then(()=> {
    req.flash('success', notify.EDIT_SUCCESS, false);
    res.redirect(linkIndex);
  })
});

module.exports = router;
