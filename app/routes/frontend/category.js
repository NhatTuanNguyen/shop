var express = require('express');
var router = express.Router();
var productsModel = require(__path_models + 'products');
const paramsHelper = require(__path_helpers + 'params');

const folderView = __path_views_frontend + 'pages/category/';
const layoutfrontend = __path_views_frontend + 'frontend';

/* GET home page. */
router.get('/:menulv1/(:menulv2/)?(:menulv3)?', async function (req, res, next) {

  let slugMenulv1 = paramsHelper.getParams(req.params, 'menulv1', '');
  let slugMenulv2 = paramsHelper.getParams(req.params, 'menulv2', '');
  let slugMenulv3 = paramsHelper.getParams(req.params, 'menulv3', '');

  let itemsInCategory =[];

  await productsModel.listItemsFrontend({ slugMenulv1,slugMenulv2,slugMenulv3 }, { task: 'itemsInCategory' }).then((items) => {
    itemsInCategory = items
  });

  res.render(`${folderView}index`, {
    layout: layoutfrontend,
    items: itemsInCategory,
  });
});


module.exports = router;
