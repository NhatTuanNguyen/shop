var express = require('express');
var router = express.Router();
var slidersModel = require(__path_models + 'sliders');
var bannersModel = require(__path_models + 'banners');
var brandsModel = require(__path_models + 'brands');
var productsModel = require(__path_models + 'products');

const folderView = __path_views_frontend + 'pages/home/';
const layoutfrontend = __path_views_frontend + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  let itemsSlider = [];
  let itemsBanner = [];
  let itemsBrand = [];
  let itemsProduct = [];

  await slidersModel.listItemsFrontend().then((items)=>{
    itemsSlider = items
  });

  await bannersModel.listItemsFrontend().then((items)=>{
    itemsBanner = items
  });

  await brandsModel.listItemsFrontend().then((items)=>{
    itemsBrand = items
  });
  
  await productsModel.listItemsFrontend('',{task:'all'}).then((items)=>{
    itemsProduct = items
  });

  res.render(`${folderView}index`,{
    layout:layoutfrontend,
    items:itemsProduct,
    itemsSlider,
    itemsBanner,
    itemsBrand,
  });
});


module.exports = router;
