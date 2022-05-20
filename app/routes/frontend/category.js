var express = require('express');
var router = express.Router();
var categoryModel = require(__path_models + 'category');
var articleModel = require(__path_models + 'article');
const paramsHelper = require(__path_helpers + 'params');

const folderView = __path_views_frontend + 'pages/category/';
const layoutfrontend = __path_views_frontend + 'frontend';

/* GET home page. */
router.get('/:slug', async function (req, res, next) {
  let itemsInCategory = [];
  let category = [];
  let idCategory =''
  let slugCategory = paramsHelper.getParams(req.params, 'slug', '');

  await categoryModel.getItemsFromSlug(slugCategory).then((items) => {
    idCategory = items[0].id
  });
  
  await articleModel.listItemsFrontend({ id: idCategory }, { task: 'itemsInCategory' }).then((items) => {
    itemsInCategory = items
  });

  await categoryModel.listItemsFrontend({ id: idCategory }, { task: 'category' }).then((items) => {
    category = items
  });

  res.render(`${folderView}index`, {
    layout: layoutfrontend,
    top_post: false,
    category,
    itemsInCategory,
  });
});


module.exports = router;
