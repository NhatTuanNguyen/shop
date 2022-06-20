const express = require('express');
const router = express.Router();
const getMenuMiddleware =require(__path_middleware + 'get-menu');
const getSettingMiddleware =require(__path_middleware + 'get-setting');
const getCartProductsMiddleware =require(__path_middleware + 'get-cart-products');
const getUserInfogMiddleware =require(__path_middleware + 'get-user-info');

router.use('(/home)?',
    getMenuMiddleware,
    getSettingMiddleware,
    getCartProductsMiddleware,
    getUserInfogMiddleware,
    require('./home'));
router.use('/auth', require('./auth'));
router.use('/contact', require('./contact'));
router.use('/search', require('./search'));
router.use('/cart', require('./cart'));
router.use('/profile', require('./profile'));
router.use('/orders', require('./orders'));
router.use('/:slug', require('./products'));

module.exports = router;