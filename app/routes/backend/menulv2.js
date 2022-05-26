var express = require('express');

var router = express.Router();

const util = require('util');
var menulv1Model = require(__path_models + 'menulv1');
var menulv2Model = require(__path_models + 'menulv2');
const validatorMenulv2 = require(__path_validators + 'menulv2');
const ultilsHelper = require(__path_helpers + 'ultils');
const paramsHelper = require(__path_helpers + 'params');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/menulv2`;

const pageTitleIndex = 'menulv2 Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + 'pages/menulv2/';

/* GET menulv2 listing. */
router.get('(/status/:status)?', async (req, res, next) => {
  let params = {};
  params.keyword = paramsHelper.getParams(req.query, 'keyword', "");
  params.currentStatus = paramsHelper.getParams(req.params, 'status', 'all');
  params.sortField = paramsHelper.getParams(req.session, 'sort_field', 'name');
  params.sortType = paramsHelper.getParams(req.session, 'sort_type', 'asc');
  params.categoryId = paramsHelper.getParams(req.session, 'menulv1_id', 'novalue');
  let statusFilter = await ultilsHelper.createFilterStatus(params, 'menulv2','menulv1');

  params.paginations = {
    totalItems: 1,
    totalItemPerPage: 5,
    currentPage: 1,
    pageRanges: 3,
  };

  params.paginations.currentPage = parseInt(paramsHelper.getParams(req.query, 'page', 1));

  await menulv2Model.countItems(params).then((data) => {
    params.paginations.totalItems = data
  });

  await menulv1Model.listItemsInSelecbox().then((items) => {
    params.menulv1Items = items;
    params.menulv1Items.unshift({ _id: '', name: 'All category' });
  });

  menulv2Model.listItems(params)
    .then((items) => {
      res.render(`${folderView}list`, {
        pageTitle: pageTitleIndex,
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

  menulv2Model.changeStatus(currentStatus, id).then(() => {
    res.send(currentStatus);
  });
});

// change multiple status
router.post('/changeStatus/:status', function (req, res, next) {
  let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');

  menulv2Model.changeStatus(currentStatus, req.body.cid, 'updateMutiple').then((result) => {
    req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.matchedCount), false);
    res.redirect(linkIndex);
  });
});

// delete
router.get('/delete/:id', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  menulv2Model.deleteItems(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// delete multiple menulv2
router.post('/delete', function (req, res, next) {
  menulv2Model.deleteItems(req.body.cid, 'deleteMutiple').then(() => {
    req.flash('success', notify.DELETE_MULTI_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// change ordering
router.post('/changeOrdering', function (req, res, next) {

  // use Ajax
  let id = req.body.id;
  let orderings = req.body.value;

  menulv2Model.changeOrdering(orderings, id).then(() => {
    res.json('Cập nhật thành công');
  });
});

// change category
router.post('/changeType', function (req, res, next) {
  let id = req.body.id;
  let idType = req.body.idType;
  let nameSelect = req.body.nameSelect;

  menulv2Model.changeType(nameSelect, id, idType).then(() => {
    res.send('Cập nhật category thành công');
  });
});

// Form
router.get('/form(/:id)?', async function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');
  let item = { name: '', ordering: 0, status: 'novalue',menulv1:[{id: '',name:''}] };
  let errors = null;
  let params = {};

  await menulv1Model.listItemsInSelecbox().then((items) => {
    params.menulv1Items = items;
    params.menulv1Items.unshift({ _id: '', name: 'Choose category' });
  });

  if (id === '') {//ADD
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors, params });
  } else {//EDIT
    menulv2Model.getItems(id).then((item) => {
      res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors, params });
    });
  }
});

// Save
router.post('/save', async (req, res, next) => {
    let item = Object.assign(req.body);
    let taskCurrent = (typeof item !== 'undefined' && item.id !== "") ? 'edit' : 'add';

    let errors = validatorMenulv2.validator(req);
    let params = {};

    if (errors.length <= 0) {
      let message = taskCurrent == 'add' ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
      
      menulv2Model.saveItems(item, taskCurrent).then(() => {
        req.flash('success', message, false);
        res.redirect(linkIndex);
      });
    } else {
      await menulv1Model.listItemsInSelecbox().then((items) => {
        params.menulv1Items = items;
        params.menulv1Items.unshift({ _id: '', name: 'Choose category' });
      });
      let pageTitle = taskCurrent == 'add' ? pageTitleAdd : pageTitleEdit;
      res.render(`${folderView}form`, { pageTitle: pageTitle, params, item, errors });
    }

});

// Sort
router.get('/sort/:sort_field/:sort_type', function (req, res, next) {
  req.session.sort_field = paramsHelper.getParams(req.params, 'sort_field', 'ordering');
  req.session.sort_type = paramsHelper.getParams(req.params, 'sort_type', 'asc');

  res.redirect(linkIndex);
});

// Filter
router.get('/filter-category/:menulv1_id', function (req, res, next) {
  req.session.menulv1_id = paramsHelper.getParams(req.params, 'menulv1_id', '');
  let keyword = paramsHelper.getParams(req.query, 'keyword', "");
  if(keyword) {
    res.redirect(linkIndex + '?keyword=' + keyword);
  } else {
    res.redirect(linkIndex);
  }
});

module.exports = router;
