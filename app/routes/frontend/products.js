var express = require('express');
var router = express.Router();
var productsModel = require(__path_models + 'products');
const paramsHelper = require(__path_helpers + 'params');

const layoutfrontend = __path_views_frontend + 'frontend';

/* GET home page. */
router.get('/:id', async function (req, res, next) {
  let folderView;
  let items = [];
  let randomItems = [];
  let item = [];
  let id = paramsHelper.getParams(req.params, 'id', '');
  let sortPrice = paramsHelper.getParams(req.query, 'sort', '');

  // Category
  await productsModel.listItemsFrontend({id,sort: sortPrice}, { task: 'itemsInCategory'}).then((itemsInCategory) => {
    folderView = __path_views_frontend + 'pages/category/';
    items = itemsInCategory;
  });

  // Random
  await productsModel.listItemsFrontend({id,sort: sortPrice}, { task: 'random'}).then((items) => {
    randomItems = items;
  });

  //item products
  if(items.length == 0) {
    folderView = __path_views_frontend + 'pages/products/';
    await productsModel.getItemFrontend({id}).then((items) => {
      item = items;
    }).catch((err) => {});
  }

  if(item == null ) {
    folderView = __path_views_frontend + 'pages/category/';
  }
  
  res.render(`${folderView}index`, {
    layout: layoutfrontend,
    items,
    item,
    id,
    randomItems,
  });
});


module.exports = router;
