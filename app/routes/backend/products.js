var express = require('express');

var router = express.Router();

const util = require('util');
var productsModel = require(__path_models + 'products');
var menulv3Model = require(__path_models + 'menulv3');
const validatorProducts = require(__path_validators + 'products');
const ultilsHelper = require(__path_helpers + 'ultils');
const paramsHelper = require(__path_helpers + 'params');
const fileHelper = require(__path_helpers + 'file');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/products`;

const pageTitleIndex = 'Products Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + 'pages/products/';
uploadThumb = fileHelper.upload('thumb', 'products');

/* GET products listing. */
router.get('(/status/:status)?', async (req, res, next) => {
  let params = {};
  params.keyword = paramsHelper.getParams(req.query, 'keyword', "");
  params.currentStatus = paramsHelper.getParams(req.params, 'status', 'all');
  params.sortField = paramsHelper.getParams(req.session, 'sort_field', 'ordering');
  params.sortType = paramsHelper.getParams(req.session, 'sort_type', 'asc');
  params.categoryId = paramsHelper.getParams(req.session, 'menulv3_id', 'novalue');
  let statusFilter = await ultilsHelper.createFilterStatus(params, 'products','menulv3');

  params.paginations = {
    totalItems: 1,
    totalItemPerPage: 5,
    currentPage: 1,
    pageRanges: 3,
  };


  await menulv3Model.listItemsInSelecbox().then((items) => {
    params.menulv3Items = items;
    params.menulv3Items.unshift({ _id: '', name: 'All category' });
  });


  params.paginations.currentPage = parseInt(paramsHelper.getParams(req.query, 'page', 1));

  await productsModel.countItems(params).then((data) => {
    params.paginations.totalItems = data
  });

  productsModel.listItems(params)
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

  productsModel.changeStatus(currentStatus, id).then(() => {
    res.send(currentStatus);
  });
});

// change special
router.get('/changeSpecial/:id/:special', function (req, res, next) {
  let currentSpecial = paramsHelper.getParams(req.params, 'special', 'active');
  let id = paramsHelper.getParams(req.params, 'id', '');

  productsModel.changeSpecial(currentSpecial, id).then(() => {
    res.send(currentSpecial);
  });
});

// change multiple status
router.post('/changeStatus/:status', function (req, res, next) {
  let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');

  productsModel.changeStatus(currentStatus, req.body.cid, 'updateMutiple').then((result) => {
    req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.matchedCount), false);
    res.redirect(linkIndex);
  });
});

// delete
router.get('/delete/:id', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  productsModel.deleteItems(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// delete multiple products
router.post('/delete', function (req, res, next) {
  productsModel.deleteItems(req.body.cid, 'deleteMutiple').then(() => {
    req.flash('success', notify.DELETE_MULTI_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// change ordering
router.post('/changeOrdering', function (req, res, next) {

  // use Ajax
  let id = req.body.id;
  let orderings = req.body.value;

  productsModel.changeOrdering(orderings, id).then(() => {
    res.json('Cập nhật thành công');
  });
});

// change category
router.post('/changeType', function (req, res, next) {
  let id = req.body.id;
  let idType = req.body.idType;
  let nameSelect = req.body.nameSelect;

  productsModel.changeType(nameSelect, id, idType).then(() => {
    res.send('Cập nhật category thành công');
  });
});

// Form
router.get('/form(/:id)?', async function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');
  let item = { name: '', ordering: 0, status: 'novalue',menulv3:[{id: '',name:''}] };
  let errors = null;
  let params = {};
  await menulv3Model.listItemsInSelecbox().then((items) => {
    params.menulv3Items = items;
    params.menulv3Items.unshift({ _id: '', name: 'Choose category' });
  });

  if (id === '') {//ADD
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors, params });
  } else {//EDIT
    productsModel.getItems(id).then((item) => {
      res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors, params });
    });
  }
});

// Save
router.post('/save', (req, res, next) => {
  uploadThumb(req, res, async function (errUpload) {
    let item = Object.assign(req.body);
    let taskCurrent = (typeof item !== 'undefined' && item.id !== "") ? 'edit' : 'add';

    let errors = validatorProducts.validator(req, errUpload, taskCurrent);
    let params = {};

    if (errors.length <= 0) {
      let message = taskCurrent == 'add' ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
      if (req.file == undefined) {
        item.thumb = item.image_old;
      } else {
        item.thumb = req.file.filename;
        if (taskCurrent == 'edit') {
          fileHelper.remove('public/uploads/products/', item.image_old);
        }
      }
      productsModel.saveItems(item, taskCurrent).then(() => {
        req.flash('success', message, false);
        res.redirect(linkIndex);
      });
    } else {
      let pageTitle = taskCurrent == 'add' ? pageTitleAdd : pageTitleEdit;
      if(req.file != undefined) fileHelper.remove('public/uploads/products/', req.file.filename); // xóa tấm hình khi form không hợp lệ
      await menulv3Model.listItemsInSelecbox().then((items) => {
        params.menulv3Items = items;
        params.menulv3Items.unshift({ _id: '', name: 'Choose category' });
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
router.get('/filter-category/:menulv3_id', function (req, res, next) {
  req.session.menulv3_id = paramsHelper.getParams(req.params, 'menulv3_id', '');
  let keyword = paramsHelper.getParams(req.query, 'keyword', "");
  if(keyword) {
    res.redirect(linkIndex + '?keyword=' + keyword);
  } else {
    res.redirect(linkIndex);
  }
});

module.exports = router;
