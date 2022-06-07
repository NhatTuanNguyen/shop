var settingsModel = require(__path_models + 'settings');

module.exports = async (req, res, next) => {
    // items random
    await settingsModel.getItem().then((item) => {
        res.locals.itemSetting = item[0]
    });
    next();
}