var express = require('express');

var router = express.Router();

const util = require('util');
var bannersModel = require(__path_models + 'banners');
const validatorbanners = require(__path_validators + 'banners');
const ultilsHelper = require(__path_helpers + 'ultils');
const paramsHelper = require(__path_helpers + 'params');
const fileHelper = require(__path_helpers + 'file');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/banners`;

const pageTitleIndex = 'Banners Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + 'pages/banners/';
uploadThumb = fileHelper.upload('thumb', 'banners');

/* GET banners listing. */
router.get('(/status/:status)?', async (req, res, next) => {
  let params = {};
  params.keyword = paramsHelper.getParams(req.query, 'keyword', "");
  params.currentStatus = paramsHelper.getParams(req.params, 'status', 'all');
  params.sortField = paramsHelper.getParams(req.session, 'sort_field', 'name');
  params.sortType = paramsHelper.getParams(req.session, 'sort_type', 'asc');
  let statusFilter = await ultilsHelper.createFilterStatus(params, 'banners');

  params.paginations = {
    totalItems: 1,
    totalItemPerPage: 5,
    currentPage: 1,
    pageRanges: 3,
  };

  params.paginations.currentPage = parseInt(paramsHelper.getParams(req.query, 'page', 1));

  await bannersModel.countItems(params).then((data) => {
    params.paginations.totalItems = data
  });
  bannersModel.listItems(params)
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

  bannersModel.changeStatus(currentStatus, id).then(() => {
    res.send(currentStatus);
  });
});

// change multiple status
router.post('/changeStatus/:status', function (req, res, next) {
  let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');

  bannersModel.changeStatus(currentStatus, req.body.cid, 'updateMutiple').then((result) => {
    req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.matchedCount), false);
    res.redirect(linkIndex);
  });
});

// delete
router.get('/delete/:id', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  bannersModel.deleteItems(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// delete multiple banners
router.post('/delete', function (req, res, next) {
  bannersModel.deleteItems(req.body.cid, 'deleteMutiple').then(() => {
    req.flash('success', notify.DELETE_MULTI_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// change ordering
router.post('/changeOrdering', function (req, res, next) {

  // use Ajax
  let id = req.body.id;
  let orderings = req.body.value;

  bannersModel.changeOrdering(orderings, id).then(() => {
    res.json('Cập nhật thành công');
  });
});

// Form
router.get('/form(/:id)?', async function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');
  let item = { name: '', ordering: 0, status: 'novalue' };
  let errors = null;
  let params = {};

  if (id === '') {//ADD
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors, params });
  } else {//EDIT
    bannersModel.getItems(id).then((item) => {
      res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors, params });
    });
  }
});

// Save
router.post('/save', (req, res, next) => {
  uploadThumb(req, res, async function (errUpload) {
    let item = Object.assign(req.body);
    let taskCurrent = (typeof item !== 'undefined' && item.id !== "") ? 'edit' : 'add';

    let errors = validatorbanners.validator(req, errUpload, taskCurrent);
    let params = {};

    if (errors.length <= 0) {
      let message = taskCurrent == 'add' ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
      if (req.file == undefined) {
        item.thumb = item.image_old;
      } else {
        item.thumb = req.file.filename;
        if (taskCurrent == 'edit') {
          fileHelper.remove('public/uploads/banners/', item.image_old);
        }
      }
      bannersModel.saveItems(item, taskCurrent).then(() => {
        req.flash('success', message, false);
        res.redirect(linkIndex);
      });
    } else {
      let pageTitle = taskCurrent == 'add' ? pageTitleAdd : pageTitleEdit;
      if(req.file != undefined) fileHelper.remove('public/uploads/banners/', req.file.filename); // xóa tấm hình khi form không hợp lệ
      if (taskCurrent == 'edit') item.thumb = item.image_old;
      res.render(`${folderView}form`, { pageTitle: pageTitle, params, item, errors });
    }
  })

});

// Sort
router.get('/sort/:sort_field/:sort_type', function (req, res, next) {
  req.session.sort_field = paramsHelper.getParams(req.params, 'sort_field', 'ordering');
  req.session.sort_type = paramsHelper.getParams(req.params, 'sort_type', 'asc');

  res.redirect(linkIndex);
});


module.exports = router;
