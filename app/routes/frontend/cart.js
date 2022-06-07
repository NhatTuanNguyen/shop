var express = require('express');
var router = express.Router();
var productsModel = require(__path_models + 'products');
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
    var cartProduct =[]
    items = req.body.cart
    if(items != undefined && items.length > 0 && items != '') {
        items = JSON.parse(items)
        items.forEach(item => {
            idArray.push(item.id);
        });
        await productsModel.getItemFrontend({id:idArray},'findMultiple').then((itemscartProduct) => {
          for(var i = 0; i <idArray.length; i++) {
            for(var j = 0; j <itemscartProduct.length; j++){
              if(idArray[i] == itemscartProduct[j].id){
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
  res.render(`${folderView}checkout`, {
    layout: layoutfrontend,
  });
});

module.exports = router;
