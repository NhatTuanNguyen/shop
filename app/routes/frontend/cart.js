var express = require('express');
var router = express.Router();
const axios = require('axios');
var productsModel = require(__path_models + 'products');
var couponsModel = require(__path_models + 'coupons');
const paramsHelper = require(__path_helpers + 'params');

const layoutfrontend = __path_views_frontend + 'frontend';
const folderView = __path_views_frontend + 'pages/cart/';

/* GET cart page. */
router.get('/', async function (req, res, next) {
  res.render(`${folderView}index`, {
    layout: layoutfrontend,
  });
});

// Get cart items
router.post('/', async function (req, res, next) {
  let items = [];
  var idArray = [];
  var cartProduct = []
  items = req.body.cart
  if (items != undefined && items.length > 0 && items != '') {
    items = JSON.parse(items)
    items.forEach(item => {
      idArray.push(item.id);
    });
    await productsModel.getItemFrontend({ id: idArray }, 'findMultiple').then((itemscartProduct) => {
      for (var i = 0; i < idArray.length; i++) {
        for (var j = 0; j < itemscartProduct.length; j++) {
          if (idArray[i] == itemscartProduct[j].id) {
            cartProduct.push(itemscartProduct[j]);
            break;
          }
        }
      }
    });
  }
  res.json(cartProduct);
});

// Checkout
router.get('/checkout', async function (req, res, next) {
 
  // await axios.get('https://provinces.open-api.vn/api/?depth=2').then((data) => {
  //   res.json(data.data)
  // }).catch((err) => {
  //   console.log(err);
  // });;
  res.render(`${folderView}checkout`, {
    layout: layoutfrontend,
  });
});

// Apply coupon
router.get('/coupon', async function (req, res, next) {
  let value = req.query.value;
  let data={};
  await couponsModel.getItemsByName(value).then((items) => {
    data = items[0];
    if(data == undefined) data = {};
  }).catch((err) => {data = {};});
  res.json(data)
});

module.exports = router;
