const express = require('express');
const router = express.Router();
const getMenuMiddleware =require(__path_middleware + 'get-menu');

router.use('/',getMenuMiddleware,require('./home'));
router.use('/category', require('./category'));
// router.use('/lien-he', require('./contact'));
router.use('/products', require('./products'));

module.exports = router;