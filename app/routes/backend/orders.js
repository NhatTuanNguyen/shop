var express = require('express');

var router = express.Router();

const util = require('util');
var ordersModel = require(__path_models + 'orders');
var orderStatusModel = require(__path_models + 'order-status');
const ultilsHelper = require(__path_helpers + 'ultils');
const paramsHelper = require(__path_helpers + 'params');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/orders`;

const pageTitleIndex = 'Orders Management';
const pageTitleView = 'Order details';
const folderView = __path_views_admin + 'pages/orders/';

/* GET orders listing. */
router.get('(/status/:status)?', async (req, res, next) => {
  let params = {};
  params.keyword = paramsHelper.getParams(req.query, 'keyword', "");
  // params.currentStatus = paramsHelper.getParams(req.params, 'status', 'all');
  params.sortField = paramsHelper.getParams(req.session, 'sort_field', 'time');
  params.sortType = paramsHelper.getParams(req.session, 'sort_type', 'desc');
  params.orderStatusId = paramsHelper.getParams(req.session, 'status_id', 'novalue');
  // let statusFilter = await ultilsHelper.createFilterStatus(params, 'orders');

  params.paginations = {
    totalItems: 1,
    totalItemPerPage: 5,
    currentPage: 1,
    pageRanges: 3,
  };

  await orderStatusModel.listItemsInSelecbox().then((items) => {
    params.orderStatusItems = items;
    params.orderStatusItems.unshift({ _id: '', name: 'All Status', })
  });

  params.paginations.currentPage = parseInt(paramsHelper.getParams(req.query, 'page', 1));

  await ordersModel.countItems(params).then((data) => {
    params.paginations.totalItems = data
  });

  ordersModel.listItems(params)
    .then((items) => {
      res.render(`${folderView}list`, {
        pageTitle: pageTitleIndex,
        items: items,
        // statusFilter: statusFilter,
        params
      });
    });

});

// change group
router.post('/changeType', function (req, res, next) {
  let id = req.body.id;
  let idType = req.body.idType;
  let nameSelect = req.body.nameSelect;

  ordersModel.changeType(nameSelect, id,idType).then(() => {
    res.send('Cập nhật group thành công');
  });
});

// change status
// router.get('/changeStatus/:id/:status', function (req, res, next) {
//   let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');
//   let id = paramsHelper.getParams(req.params, 'id', '');

//   ordersModel.changeStatus(currentStatus, id).then(() => {
//     res.send(currentStatus);
//   });
// });

// change multiple status
// router.post('/changeStatus/:status', function (req, res, next) {
//   let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');

//   ordersModel.changeStatus(currentStatus, req.body.cid, 'updateMutiple').then((result) => {
//     req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.matchedCount), false);
//     res.redirect(linkIndex);
//   });
// });

// delete
router.get('/delete/:id', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  ordersModel.deleteItems(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// delete multiple orders
router.post('/delete', function (req, res, next) {
  ordersModel.deleteItems(req.body.cid, 'deleteMutiple').then(() => {
    req.flash('success', notify.DELETE_MULTI_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// Form
router.get('/view/:id', async function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  ordersModel.getItems(id).then((item) => {
    res.render(`${folderView}view`, { pageTitle: pageTitleView, item, });
  });
});

// Sort
router.get('/sort/:sort_field/:sort_type', function (req, res, next) {
  req.session.sort_field = paramsHelper.getParams(req.params, 'sort_field', 'ordering');
  req.session.sort_type = paramsHelper.getParams(req.params, 'sort_type', 'asc');

  res.redirect(linkIndex);
});

// Filter
router.get('/filter-order-status/:status_id', function (req, res, next) {
  req.session.status_id = paramsHelper.getParams(req.params, 'status_id', '');
  let keyword = paramsHelper.getParams(req.query, 'keyword', "");
  if(keyword) {
    res.redirect(linkIndex + '?keyword=' + keyword);
  } else {
    res.redirect(linkIndex);
  };
});
module.exports = router;
