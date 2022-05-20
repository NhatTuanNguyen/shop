var express = require('express');
var router = express.Router();
const util = require('util');
var itemsModel = require(__path_models + 'items');
const ultilsHelper = require(__path_helpers + 'ultils');
const paramsHelper = require(__path_helpers + 'params');
const validatorItems = require(__path_validators + 'items');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/items`;

const pageTitleIndex = 'Item Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + 'pages/items/'

/* GET users listing. */
router.get('(/status/:status)?', async (req, res, next) => {

  let params = {};
  params.keyword = paramsHelper.getParams(req.query, 'keyword', "");
  params.currentStatus = paramsHelper.getParams(req.params, 'status', 'all');
  params.sortField = paramsHelper.getParams(req.session, 'sort_field', 'name');
  params.sortType = paramsHelper.getParams(req.session, 'sort_type', 'asc');
  let statusFilter = await ultilsHelper.createFilterStatus(params, 'items');

  params.paginations = {
    totalItems: 1,
    totalItemPerPage: 5,
    currentPage: 1,
    pageRanges: 3,
  };

  params.paginations.currentPage = parseInt(paramsHelper.getParams(req.query, 'page', 1));

  await itemsModel.countItems(params).then((data) => {
    params.paginations.totalItems = data
  });

  itemsModel.listItems(params)
    .then((items) => {
      res.render(`${folderView}list`, {
        pageTitle: 'pageTitleIndex',
        items: items,
        statusFilter: statusFilter,
        params
      });
    });

});

// change status
router.get('/changeStatus/:id/:status', function (req, res, next) {
  let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');
  let id = paramsHelper.getParams(req.params, 'id', '');

  itemsModel.changeStatus(currentStatus, id).then(() => {
    res.send(currentStatus);
  });
});

// change multiple status
router.post('/changeStatus/:status', function (req, res, next) {
  let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');

  itemsModel.changeStatus(currentStatus, req.body.cid, 'updateMutiple').then((result) => {
    req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.matchedCount), false);
    res.redirect(linkIndex);
  });
});

// delete
router.get('/delete/:id', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  itemsModel.deleteItems(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// delete multiple items
router.post('/delete', function (req, res, next) {
  itemsModel.deleteItems(req.body.cid, 'deleteMutiple').then(() => {
    req.flash('success', notify.DELETE_MULTI_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// change ordering
router.post('/changeOrdering', function (req, res, next) {
  // let cids = req.body.cid;
  // let orderings = req.body.ordering;

  // itemsModel.changeOrdering(orderings, cids).then(() => {
  //   req.flash('success', notify.CHANGE_ORDERING, false);
  //   res.redirect(linkIndex);
  // });

  // use Ajax
  let id = req.body.id;
  let orderings = req.body.value;

  itemsModel.changeOrdering(orderings, id).then(() => {
    res.json('Cập nhật thành công');
  });
});

// Form
router.get('/form(/:id)?', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');
  let item = { name: '', ordering: 0, status: 'novalue' };
  let errors = null;

  if (id === '') {//ADD
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors });
  } else {//EDIT
    itemsModel.getItems(id).then((item) => {
      res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors });
    });
  }
});

// Save
router.post('/save', (req, res, next) => {
  let errors = validatorItems.validator(req);
  let item = Object.assign(req.body);
  let taskCurrent = (typeof item !== 'undefined' && item.id !== "") ? 'edit' : 'add';

  if (errors.length <= 0) {
    let message = taskCurrent == 'add' ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
    itemsModel.saveItems(item, taskCurrent).then(() => {
      req.flash('success', message, false);
      res.redirect(linkIndex);
    });
  } else {
    let pageTitle = taskCurrent == 'add' ? pageTitleAdd : pageTitleEdit;
    res.render(`${folderView}form`, { pageTitle: pageTitle, item, errors });
  }
});

router.get('/sort/:sort_field/:sort_type', function (req, res, next) {
  req.session.sort_field = paramsHelper.getParams(req.params, 'sort_field', 'ordering');
  req.session.sort_type = paramsHelper.getParams(req.params, 'sort_type', 'asc');

  res.redirect(linkIndex);
});

module.exports = router;
