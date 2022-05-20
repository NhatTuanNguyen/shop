var express = require('express');
var router = express.Router();
const util = require('util');
var categoryModel = require(__path_models + 'category');
const validatorCategory = require(__path_validators + 'category');
const ultilsHelper = require(__path_helpers + 'ultils');
const paramsHelper = require(__path_helpers + 'params');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/category`;

const pageTitleIndex = 'category Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + 'pages/category/'

/* GET users listing. */
router.get('(/status/:status)?', async (req, res, next) => {

  let params = {};
  params.keyword = paramsHelper.getParams(req.query, 'keyword', "");
  params.currentStatus = paramsHelper.getParams(req.params, 'status', 'all');
  params.sortField = paramsHelper.getParams(req.session, 'sort_field', 'name');
  params.sortType = paramsHelper.getParams(req.session, 'sort_type', 'asc');
  let statusFilter = await ultilsHelper.createFilterStatus(params, 'category');

  params.paginations = {
    totalItems: 1,
    totalItemPerPage: 5,
    currentPage: 1,
    pageRanges: 3,
  };

  await categoryModel.listItemsCategoryParent().then((items) => {
    params.categoryItems = items;
    params.categoryItems.unshift({ id: 1, name: 'Parrent category' })
  });

  params.paginations.currentPage = parseInt(paramsHelper.getParams(req.query, 'page', 1));

  await categoryModel.countItems(params).then((data) => {
    params.paginations.totalItems = data
  });

  categoryModel.listItems(params)
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

  categoryModel.changeStatus(currentStatus, id).then(() => {
    res.send(currentStatus);
  });
});

// change multiple status
router.post('/changeStatus/:status', function (req, res, next) {
  let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');

  categoryModel.changeStatus(currentStatus, req.body.cid, 'updateMutiple').then((result) => {
    req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.matchedCount), false);
    res.redirect(linkIndex);
  });
});

// delete
router.get('/delete/:id', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  categoryModel.deleteItems(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// delete multiple items
router.post('/delete', function (req, res, next) {
  categoryModel.deleteItems(req.body.cid, 'deleteMutiple').then(() => {
    req.flash('success', notify.DELETE_MULTI_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// change ordering
router.post('/changeOrdering', function (req, res, next) {

  // use Ajax
  let id = req.body.id;
  let orderings = req.body.value;

  categoryModel.changeOrdering(orderings, id).then(() => {
    res.json('Cập nhật thành công');
  });
});

// change category
router.post('/changeType', function (req, res, next) {
  let id = req.body.id;
  let idType = req.body.idType;
  let nameSelect = req.body.nameSelect;

  categoryModel.changeType(nameSelect, id, idType).then(() => {
    res.send('Cập nhật category thành công');
  });
});

// Form
router.get('/form(/:id)?', async function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');
  let item = { name: '', ordering: 0, status: 'novalue' };
  let errors = null;
  let params = {};

  await categoryModel.listItemsCategoryParent().then((items) => {
    params.categoryItems = items;
    params.categoryItems.unshift({ id: 1, name: 'Parrent category' })
  });

  if (id === '') {//ADD
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors,params });
  } else {//EDIT
    categoryModel.getItems(id).then((item) => {
      item.category_id = item.category.id;
      item.category_name = item.category.name;
      res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors,params });
    });
  }
});

// Save
router.post('/save', async (req, res, next) => {
  validatorCategory.validator(req);
	let item = Object.assign(req.body);
	let errors = req.validationErrors();
  let params = {};
  
  let taskCurrent = (typeof item !== 'undefined' && item.id !== "") ? 'edit' : 'add';
  if (!errors) {
    let message = taskCurrent == 'add' ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
    categoryModel.saveItems(item, taskCurrent).then(() => {
      req.flash('success', message, false);
      res.redirect(linkIndex);
    });
  } else {
    let pageTitle = taskCurrent == 'add' ? pageTitleAdd : pageTitleEdit;
    await categoryModel.listItemsCategoryParent().then((items) => {
      params.categoryItems = items;
      params.categoryItems.unshift({ id: 1, name: 'Parrent category' })
    });
    res.render(`${folderView}form`, { pageTitle: pageTitle, item, errors,params });
  }
});

router.get('/sort/:sort_field/:sort_type', function (req, res, next) {
  req.session.sort_field = paramsHelper.getParams(req.params, 'sort_field', 'ordering');
  req.session.sort_type = paramsHelper.getParams(req.params, 'sort_type', 'asc');

  res.redirect(linkIndex);
});


module.exports = router;
