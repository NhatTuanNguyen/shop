var express = require('express');

var router = express.Router();

const util = require('util');
var productModel = require(__path_models + 'product');
var categoryModel = require(__path_models + 'category');
const validatorProduct = require(__path_validators + 'product');
const ultilsHelper = require(__path_helpers + 'ultils');
const paramsHelper = require(__path_helpers + 'params');
const fileHelper = require(__path_helpers + 'file');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/product`;

const pageTitleIndex = 'Product Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + 'pages/product/';
uploadThumb = fileHelper.upload('thumb', 'product');

/* GET product listing. */
router.get('(/status/:status)?', async (req, res, next) => {
  let params = {};
  params.keyword = paramsHelper.getParams(req.query, 'keyword', "");
  params.currentStatus = paramsHelper.getParams(req.params, 'status', 'all');
  params.sortField = paramsHelper.getParams(req.session, 'sort_field', 'ordering');
  params.sortType = paramsHelper.getParams(req.session, 'sort_type', 'asc');
  params.categoryId = paramsHelper.getParams(req.session, 'category_id', 'novalue');
  let statusFilter = await ultilsHelper.createFilterStatus(params, 'product');

  params.paginations = {
    totalItems: 1,
    totalItemPerPage: 5,
    currentPage: 1,
    pageRanges: 3,
  };


  await categoryModel.listItemsCategoryProduct().then((items) => {
    params.categoryItems = items;
    params.categoryItems.unshift({ _id: '', name: 'All category' })
  });

  params.paginations.currentPage = parseInt(paramsHelper.getParams(req.query, 'page', 1));

  await productModel.countItems(params).then((data) => {
    params.paginations.totalItems = data
  });
  productModel.listItems(params)
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

  productModel.changeStatus(currentStatus, id).then(() => {
    res.send(currentStatus);
  });
});

// change special
router.get('/changeSpecial/:id/:special', function (req, res, next) {
  let currentSpecial = paramsHelper.getParams(req.params, 'special', 'active');
  let id = paramsHelper.getParams(req.params, 'id', '');

  productModel.changeSpecial(currentSpecial, id).then(() => {
    res.send(currentSpecial);
  });
});

// change multiple status
router.post('/changeStatus/:status', function (req, res, next) {
  let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');

  productModel.changeStatus(currentStatus, req.body.cid, 'updateMutiple').then((result) => {
    req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.matchedCount), false);
    res.redirect(linkIndex);
  });
});

// delete
router.get('/delete/:id', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  productModel.deleteItems(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// delete multiple product
router.post('/delete', function (req, res, next) {
  productModel.deleteItems(req.body.cid, 'deleteMutiple').then(() => {
    req.flash('success', notify.DELETE_MULTI_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// change ordering
router.post('/changeOrdering', function (req, res, next) {

  // use Ajax
  let id = req.body.id;
  let orderings = req.body.value;

  productModel.changeOrdering(orderings, id).then(() => {
    res.json('Cập nhật thành công');
  });
});

// change category
router.post('/changeType', function (req, res, next) {
  let id = req.body.id;
  let idType = req.body.idType;
  let nameSelect = req.body.nameSelect;

  productModel.changeType(nameSelect, id, idType).then(() => {
    res.send('Cập nhật category thành công');
  });
});

// Form
router.get('/form(/:id)?', async function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');
  let item = { name: '', ordering: 0, status: 'novalue' };
  let errors = null;
  let params = {};
  await categoryModel.listItemsCategoryProduct().then((items) => {
    params.categoryItems = items;
    params.categoryItems.unshift({ _id: '', name: 'Choose category' })
  });

  if (id === '') {//ADD
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors, params });
  } else {//EDIT
    productModel.getItems(id).then((item) => {
      item.category_id = item.category.id;
      item.category_name = item.category.name;
      res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors, params });
    });
  }
});

// Save
router.post('/save', (req, res, next) => {
  uploadThumb(req, res, async function (errUpload) {
    let item = Object.assign(req.body);
    let taskCurrent = (typeof item !== 'undefined' && item.id !== "") ? 'edit' : 'add';

    let errors = validatorProduct.validator(req, errUpload, taskCurrent);
    let params = {};

    if (errors.length <= 0) {
      let message = taskCurrent == 'add' ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
      if (req.file == undefined) {
        item.thumb = item.image_old;
      } else {
        item.thumb = req.file.filename;
        if (taskCurrent == 'edit') {
          fileHelper.remove('public/uploads/product/', item.image_old);
        }
      }
      productModel.saveItems(item, taskCurrent).then(() => {
        req.flash('success', message, false);
        res.redirect(linkIndex);
      });
    } else {
      let pageTitle = taskCurrent == 'add' ? pageTitleAdd : pageTitleEdit;
      if(req.file != undefined) fileHelper.remove('public/uploads/product/', req.file.filename); // xóa tấm hình khi form không hợp lệ
      await categoryModel.listItemsCategoryProduct().then((items) => {
        params.categoryItems = items;
        params.categoryItems.unshift({ _id: '', name: 'All category' });
      });
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

// Filter
router.get('/filter-category/:category_id', function (req, res, next) {
  req.session.category_id = paramsHelper.getParams(req.params, 'category_id', '');
  let keyword = paramsHelper.getParams(req.query, 'keyword', "");
  if(keyword) {
    res.redirect(linkIndex + '?keyword=' + keyword);
  } else {
    res.redirect(linkIndex);
  }
});

module.exports = router;
