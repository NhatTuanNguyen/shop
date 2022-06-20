var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var ejs = require("ejs");

var productsModel = require(__path_models + 'products');
var couponsModel = require(__path_models + 'coupons');
var orderStatusModel = require(__path_models + 'order-status');
var ordersModel = require(__path_models + 'orders');
const paramsHelper = require(__path_helpers + 'params');
var notify = require(__path_configs + 'notify');

const layoutfrontend = __path_views_frontend + 'frontend';
const folderView = __path_views_frontend + 'pages/cart/';
const filename = __path_views_frontend + 'mail/order.ejs';
const linkLogin = '/auth/login',linkIndex='/cart';


const orderid = require('order-id')('key');


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

router.post('/order',async function (req, res, next){
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'nhattuannguyenuit@gmail.com',
      pass: 'xircigasuzpqwpae'
    }
  }));
  
  let item = req.body;
  item.status ='News';
  item.order_id = orderid.generate().split('-').join('');
  await orderStatusModel.getItemByName('News').then((items)=>{
    item.status={
      id: items[0].id,
      name: 'News'
    }
  });

  let htmlSendMail=''
  ejs.renderFile(filename,{order_id: item.order_id}, function(err, str){
    htmlSendMail = str;
  });

  ordersModel.saveItems(item).then(()=>{
    req.flash('success', notify.ORDER_SUCCESS, false);
    res.redirect(linkIndex);
    var mailOptions = {
      from: 'nhattuannguyenuit@gmail.com',
      to: item.email,
      subject: 'Order success',
      // text: 'please check!',
      html: htmlSendMail,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  })
})

// Checkout
router.get('/checkout', async function (req, res, next) {
  if(req.isAuthenticated()){
    res.render(`${folderView}checkout`, {
      layout: layoutfrontend,
    });
  } else {
    req.session.returnTo = req.originalUrl; 
    res.redirect(linkLogin);
  }
  // res.render(`${folderView}checkout`, {
  //   layout: layoutfrontend,
  // });
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
