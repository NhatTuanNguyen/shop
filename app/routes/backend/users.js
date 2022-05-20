var express = require('express');

var router = express.Router();

const util = require('util');
var usersModel = require(__path_models + 'users');
var groupsModel = require(__path_models + 'groups');
const validatorUsers = require(__path_validators + 'users');
const ultilsHelper = require(__path_helpers + 'ultils');
const paramsHelper = require(__path_helpers + 'params');
const fileHelper = require(__path_helpers + 'file');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/users`;

const pageTitleIndex = 'Users Management';
const pageTitleAdd = pageTitleIndex + ' - Add';
const pageTitleEdit = pageTitleIndex + ' - Edit';
const folderView = __path_views_admin + 'pages/users/';
uploadAvatar = fileHelper.upload('avatar');

/* GET users listing. */
router.get('(/status/:status)?', async (req, res, next) => {

  let params = {};
  params.keyword = paramsHelper.getParams(req.query, 'keyword', "");
  params.currentStatus = paramsHelper.getParams(req.params, 'status', 'all');
  params.sortField = paramsHelper.getParams(req.session, 'sort_field', 'ordering');
  params.sortType = paramsHelper.getParams(req.session, 'sort_type', 'asc');
  params.groupId = paramsHelper.getParams(req.session, 'group_id', 'novalue');
  let statusFilter = await ultilsHelper.createFilterStatus(params, 'users');

  params.paginations = {
    totalItems: 1,
    totalItemPerPage: 5,
    currentPage: 1,
    pageRanges: 3,
  };


  await groupsModel.listItemsInSelecbox().then((items) => {
    params.groupItems = items;
    params.groupItems.unshift({ _id: '', name: 'All group' })
  });

  params.paginations.currentPage = parseInt(paramsHelper.getParams(req.query, 'page', 1));

  await usersModel.countItems(params).then((data) => {
    params.paginations.totalItems = data
  });

  usersModel.listItems(params)
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

  usersModel.changeStatus(currentStatus, id).then(() => {
    res.send(currentStatus);
  });
});

// change multiple status
router.post('/changeStatus/:status', function (req, res, next) {
  let currentStatus = paramsHelper.getParams(req.params, 'status', 'active');

  usersModel.changeStatus(currentStatus, req.body.cid, 'updateMutiple').then((result) => {
    req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.matchedCount), false);
    res.redirect(linkIndex);
  });
});

// delete
router.get('/delete/:id', function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');

  usersModel.deleteItems(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// delete multiple users
router.post('/delete', function (req, res, next) {
  usersModel.deleteItems(req.body.cid, 'deleteMutiple').then(() => {
    req.flash('success', notify.DELETE_MULTI_SUCCESS, false);
    res.redirect(linkIndex);
  });
});

// change ordering
router.post('/changeOrdering', function (req, res, next) {

  // use Ajax
  let id = req.body.id;
	let orderings = req.body.value;

  usersModel.changeOrdering(orderings, id).then(() => {
    res.json('Cập nhật thành công');
  });
});

// change group
router.post('/changeType', function (req, res, next) {
  let id = req.body.id;
  let idType = req.body.idType;
  let nameSelect = req.body.nameSelect;

  usersModel.changeType(nameSelect, id,idType).then(() => {
    res.send('Cập nhật group thành công');
  });
});

// Form
router.get('/form(/:id)?', async function (req, res, next) {
  let id = paramsHelper.getParams(req.params, 'id', '');
  let item = { name: '', ordering: 0, status: 'novalue' };
  let errors = null;
  let params = {};
  await groupsModel.listItemsInSelecbox().then((items) => {
    params.groupItems = items;
    params.groupItems.unshift({ _id: '', name: 'Choose group' })
  });

  if (id === '') {//ADD
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors, params });
  } else {//EDIT
    usersModel.getItems(id).then((item) => {
      item.group_id = item.group.id;
      item.group_name = item.group.name;
      res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors, params });
    });
  }
});

// Save
router.post('/save',
  // validatorUsers.validator(),
  (req, res, next) => {
    uploadAvatar(req, res, async function (errUpload) {
      let item = Object.assign(req.body);
      let taskCurrent = (typeof item !== 'undefined' && item.id !== "") ? 'edit' : 'add';

      let errors = validatorUsers.validator(req, errUpload, taskCurrent);
      let params = {};

      if (errors.length <= 0) {
        let message = taskCurrent == 'add' ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
        if (req.file == undefined) {
          item.avatar = item.image_old;
        } else {
          item.avatar = req.file.filename;
          if(taskCurrent == 'edit') {
            fileHelper.remove('public/uploads/users/',item.image_old);
          }
        }
        usersModel.saveItems(item, taskCurrent).then(() => {
          req.flash('success', message, false);
          res.redirect(linkIndex);
        });
      } else {
        let pageTitle = taskCurrent == 'add' ? pageTitleAdd : pageTitleEdit;
        if(req.file != undefined) fileHelper.remove('public/uploads/users/', req.file.filename); // xóa tấm hình khi form không hợp lệ
        await groupsModel.listItemsInSelecbox().then((items) => {
          params.groupItems = items;
          params.groupItems.unshift({ _id: '', name: 'All group' });
        });
        if (taskCurrent == 'edit') item.avatar = item.image_old;
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
router.get('/filter-group/:group_id', function (req, res, next) {
  req.session.group_id = paramsHelper.getParams(req.params, 'group_id', '');

  res.redirect(linkIndex);
});

module.exports = router;
