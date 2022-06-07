const express = require('express');
const router = express.Router();
const getMenuMiddleware =require(__path_middleware + 'get-menu');
const getSettingMiddleware =require(__path_middleware + 'get-setting');
const getCartProductsgMiddleware =require(__path_middleware + 'get-cart-products');

router.use('(/home)?',
    getMenuMiddleware,
    getSettingMiddleware,
    getCartProductsgMiddleware,
    require('./home'));
router.use('/contact', require('./contact'));
router.use('/search', require('./search'));
router.use('/cart', require('./cart'));
router.use('/:slug', require('./products'));

module.exports = router;