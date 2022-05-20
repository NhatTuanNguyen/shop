var express = require('express');
var router = express.Router();
var productModel = require(__path_models + 'product');

const folderView = __path_views_frontend + 'pages/home/';
const layoutfrontend = __path_views_frontend + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  res.render(`${folderView}index`,{
    layout:layoutfrontend,
  });
});


module.exports = router;
