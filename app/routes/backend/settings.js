var express = require('express');

var router = express.Router();

var settingsModel = require(__path_models + 'settings');
const validatorSettings = require(__path_validators + 'settings');
const fileHelper = require(__path_helpers + 'file');
var systemConfig = require(__path_configs + 'system');
var notify = require(__path_configs + 'notify');
let linkIndex = `/${systemConfig.prefixAdmin}/settings`;

const pageTitleSettings = 'Settings';
const folderView = __path_views_admin + 'pages/settings/';
uploadLogo = fileHelper.upload('logo', 'logo');

// Form
router.get('/', async function (req, res, next) {
  let item = {};
  await settingsModel.getItem().then((itemModel) => {
    item = itemModel[0]
  });
  let errors = null;
  if(item === undefined) {
    item = {media: [{}]};
  }
  res.render(`${folderView}index`, { pageTitle: pageTitleSettings,item, errors });
});

// Save
router.post('/save', (req, res, next) => {
  let data;
  uploadLogo(req, res, async function (errUpload) {
    let item = Object.assign(req.body);
    await settingsModel.getItem().then((itemModel) => {
      data = itemModel
    });
    if(data.length > 0) {
      item.id = data[0].id;
      taskCurrent = 'edit';
    } else {
      taskCurrent = 'add';
    }
    // let taskCurrent = (data.length > 0) ? 'edit' : 'add';
    let errors = validatorSettings.validator(req, errUpload,taskCurrent);

    if (errors.length <= 0) {
      if (req.file == undefined) {
        item.logo = item.image_old;
      } else {
        item.logo = req.file.filename;
        if (taskCurrent == 'edit') {
          fileHelper.remove('public/uploads/logo/', item.image_old);
        }
      }
      settingsModel.saveItems(item, taskCurrent).then(() => {
        req.flash('success', notify.EDIT_SUCCESS, false);
        res.redirect(linkIndex);
      });
    } else {
      if(req.file != undefined) fileHelper.remove('public/uploads/logo/', req.file.filename); // xóa tấm hình khi form không hợp lệ
      if (taskCurrent == 'edit') item.logo = item.image_old;
      if (taskCurrent == 'add') item.media = [item.media];
      res.render(`${folderView}index`, { pageTitle: pageTitleSettings, item, errors });
    }
  })

});


module.exports = router;
