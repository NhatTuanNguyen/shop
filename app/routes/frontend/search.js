var express = require('express');
var router = express.Router();
var productSchemasModel = require(__path_schemas + 'products');
const paramsHelper = require(__path_helpers + 'params');

const layoutfrontend = __path_views_frontend + 'frontend';
const folderView = __path_views_frontend + 'pages/search/';


/* GET home page. */
router.get('/', async function (req, res, next) {
  
  let items = [];
  let keyword = paramsHelper.getParams(req.query, 'q', "");
  await productSchemasModel.find({name: new RegExp(keyword, 'i')}).then((itemsSearch)=>{
    items = itemsSearch;
  })

  res.render(`${folderView}index`, {
    layout: layoutfrontend,
    items,
    keyword,
  });
});


module.exports = router;
