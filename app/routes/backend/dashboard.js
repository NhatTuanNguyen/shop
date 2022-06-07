var express = require('express');
var router = express.Router();

const menulv1Model = require(__path_models + 'menulv1');
const menulv2Model = require(__path_models + 'menulv2');
const menulv3Model = require(__path_models + 'menulv3');
const brandsModel = require(__path_models + 'brands');
const slidersModel = require(__path_models + 'sliders');
const bannersModel = require(__path_models + 'banners');
const groupsModel = require(__path_models + 'groups');
const productsModel = require(__path_models + 'products');
const usersModel = require(__path_models + 'users');
const contactModel = require(__path_models + 'contact');

router.get('/',async function(req, res, next) {
  let countItems = {};
  let params = {};
  params.objWhere = {};
  await menulv1Model.countItems(params).then((data) => {
    countItems.menulv1 = data
  });
  await menulv2Model.countItems(params).then((data) => {
    countItems.menulv2 = data
  });
  await menulv3Model.countItems(params).then((data) => {
    countItems.menulv3 = data
  });
  await groupsModel.countItems(params).then((data) => {
    countItems.groups = data
  });
  await productsModel.countItems(params).then((data) => {
    countItems.products = data
  });
  await usersModel.countItems(params).then((data) => {
    countItems.users = data
  });
  await brandsModel.countItems(params).then((data) => {
    countItems.brands = data
  });
  await slidersModel.countItems(params).then((data) => {
    countItems.sliders = data
  });
  await bannersModel.countItems(params).then((data) => {
    countItems.banners = data
  });

  contactModel.listItems(5).then((items) => {
    res.render(__path_views_admin + 'pages/dashboard',{ 
      pageTitle: 'dashboard',
      countItems,
      items,
    });
  });
});

module.exports = router;
