var express = require('express');
var router = express.Router();

router.use('/',require('./dashboard'));
router.use('/dashboard',require('./dashboard'));
router.use('/category',require('./category'));
router.use('/groups',require('./groups'));
router.use('/users',require('./users'));
router.use('/products',require('./products'));
router.use('/sliders',require('./sliders'));
router.use('/banners',require('./banners'));
router.use('/brands',require('./brands'));
router.use('/menulv1',require('./menulv1'));
router.use('/menulv2',require('./menulv2'));
router.use('/menulv3',require('./menulv3'));
router.use('/settings',require('./settings'));

module.exports = router;
