var menulv1Model = require(__path_models + 'menulv1');
var menulv2Model = require(__path_models + 'menulv2');
var menulv3Model = require(__path_models + 'menulv3');

module.exports = async (req, res, next) => {
    // Menu
    await menulv1Model.listItemsFrontend().then((items)=>{
        res.locals.itemsMenulv1 = items
      });
      
      await menulv2Model.listItemsFrontend().then((items)=>{
        res.locals.itemsMenulv2 = items
      });
    
      await menulv3Model.listItemsFrontend().then((items)=>{
        res.locals.itemsMenulv3 = items
      });
      res.locals.keyword = '';

    next();
}