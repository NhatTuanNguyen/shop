var express = require('express');
var router = express.Router();

const categoryModel = require(__path_models + 'category');
const groupsModel = require(__path_models + 'groups');
const productsModel = require(__path_models + 'products');
const usersModel = require(__path_models + 'users');
const contactModel = require(__path_models + 'contact');

router.get('/',async function(req, res, next) {
  let countItems = {};
  let params = {};
  params.objWhere = {};
  await categoryModel.countItems(params).then((data) => {
    countItems.category = data
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

  contactModel.listItems(5).then((items) => {
    res.render(__path_views_admin + 'pages/dashboard',{ 
      pageTitle: 'dashboard',
      countItems,
      items,
    });
  });
});

module.exports = router;
