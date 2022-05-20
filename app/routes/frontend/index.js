const express = require('express');
const router = express.Router();

router.use('/',require('./home'));
// router.use('/category', require('./category'));
// router.use('/lien-he', require('./contact'));
// router.use('/article', require('./article'));
// router.use('/general-news', require('./general-news'));

module.exports = router;