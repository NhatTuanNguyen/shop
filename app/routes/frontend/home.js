var express = require('express');
var router = express.Router();
var slidersModel = require(__path_models + 'sliders');
var bannersModel = require(__path_models + 'banners');
var menulv1Model = require(__path_models + 'menulv1');
var menulv2Model = require(__path_models + 'menulv2');
var menulv3Model = require(__path_models + 'menulv3');

const folderView = __path_views_frontend + 'pages/home/';
const layoutfrontend = __path_views_frontend + 'frontend';

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  let itemsSlider = [];
  let itemsBanner = [];
  let itemsMenulv1 = [];
  let itemsMenulv2 = [];
  let itemsMenulv3 = [];

  await slidersModel.listItemsFrontend().then((items)=>{
    itemsSlider = items
  });

  await bannersModel.listItemsFrontend().then((items)=>{
    itemsBanner = items
  });
  
  await menulv1Model.listItemsFrontend().then((items)=>{
    itemsMenulv1 = items
  });
  
  await menulv2Model.listItemsFrontend().then((items)=>{
    itemsMenulv2 = items
  });

  await menulv3Model.listItemsFrontend().then((items)=>{
    itemsMenulv3 = items
  });

  res.render(`${folderView}index`,{
    layout:layoutfrontend,
    items:itemsSlider,
    itemsBanner,
    itemsMenulv1,
    itemsMenulv2,
    itemsMenulv3,
  });
});


module.exports = router;
