var express = require('express');
var router = express.Router();
var productsModel = require(__path_models + 'products');
const paramsHelper = require(__path_helpers + 'params');

const folderView = __path_views_frontend + 'pages/products/';
const layoutfrontend = __path_views_frontend + 'frontend';

/* GET home page. */
router.get('/:slug', async function (req, res, next) {
  let item = [];
  let slugProducts = paramsHelper.getParams(req.params, 'slug', '');

  //item products
  await productsModel.getItemFrontend({slugProducts}).then((items) => {
    item = items[0];
  });


  res.render(`${folderView}index`, {
    layout: layoutfrontend,
    item,
  });
});


module.exports = router;
