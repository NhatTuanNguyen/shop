var express = require('express');
var router = express.Router();
var ordersModel = require(__path_models + 'orders');
var notify = require(__path_configs + 'notify');
const paramsHelper = require(__path_helpers + 'params');

const layoutfrontend = __path_views_frontend + 'frontend';
const folderView = __path_views_frontend + 'pages/orders/';
const linkIndex = '/orders'


/* GET home page. */
router.get('/', async function (req, res, next) {
  let items=[];
  if(req.user){
    await ordersModel.getItemsByIdUser(req.user.id).then((orders) => {
      items=orders;
    });
  }
  res.render(`${folderView}index`, {
    layout: layoutfrontend,
    items,
  });
});

router.get('/search', async function (req, res, next) {
  let orderId = paramsHelper.getParams(req.query, 'q', '');
  let item='';
  await ordersModel.getItemsByOrderId(orderId).then((items) => {
    item=items[0];
  });
  res.render(`${folderView}search`, {
    layout: layoutfrontend,
    item,
    orderId,
  });
});

router.get('(/search)?/:id', async function (req, res, next) {
  let orderId = paramsHelper.getParams(req.params, 'id', '');
  let item=''
  await ordersModel.getItemsByOrderId(orderId).then((items) => {
    item=items[0];
  });
  res.render(`${folderView}detail`, {
    layout: layoutfrontend,
    item
  });
});

module.exports = router;
