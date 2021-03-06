var Model = require(__path_schemas + 'products');
var menulv3Model = require(__path_models + 'menulv3');
var convertToSlugHelper = require(__path_helpers + 'conver-to-slug');
const fileHelper = require(__path_helpers + 'file');
const folderUpload = 'public/uploads/products/';

module.exports = {
    listItems: (params) => {
        let objWhere = {};
        if (params.categoryId !== "novalue") objWhere.menulv3 = params.categoryId;
        if (params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if (params.keyword !== "") objWhere.name = new RegExp(params.keyword, 'i');
        let sort = {};
        sort[params.sortField] = params.sortType;
        return Model
            .find(objWhere)
            .limit(params.paginations.totalItemPerPage)
            .sort(sort)
            .skip((params.paginations.currentPage - 1) * params.paginations.totalItemPerPage)
    },

    listItemsFrontend: (params = null,options = null) => {
        let find ={};
        let select = 'name';
        let sort = {};
        let limit = 40;
        switch (options.task) {
            case 'itemsInCategory':
                select = 'id name slug thumb price reduce_price menulv1 menulv2 menulv3';
                find = {status: 'active',$or: [{menulv1:params.id},{menulv2:params.id},{menulv3:params.id}]};
                if (params.sort == ''){
                    sort = {ordering: 'asc'}
                } else sort = {price: params.sort}
                break;
            case 'all':
                find={status: 'active'}
                select = 'id name slug thumb price reduce_price menulv1 menulv2 menulv3';
                sort = {ordering: 'asc'};
                limit = 16
                break;
            case 'random':
                return Model.aggregate([
                    {$match:{status: 'active'}},
                    {$project:{_id: 1,name:1,created:1,thumb:1,category:1,slug:1}},
                    {$sample:{size: 10}},
                ]);
        }

        return Model.find(find).select(select).limit(limit).sort(sort);
    },

    getItems: (id) => {
        return Model.findById(id);
    },

    getItemFrontend: (params,options='findOne') => {
        switch (options) {
            case 'findOne':
                return Model.findById(params.id)
                    .select('name thumb menulv1 menulv2 menulv3 price reduce_price description');
            case 'findMultiple':
                return Model.find({_id: {$in: params.id}}).select('name slug thumb price reduce_price');
        }
    },

    countItems: (params) => {
        let objWhere = {};
        if (params.categoryId !== "novalue" && params.categoryId !== undefined) objWhere.menulv1 = params.categoryId;
        if (params.currentStatus !== 'all' && params.currentStatus !== undefined) objWhere.status = params.currentStatus;
        if (params.keyword !== "" && params.keyword !== undefined) objWhere.name = new RegExp(params.keyword, 'i');
        return Model.count(objWhere)
    },

    changeStatus: (currentStatus, id, options = 'updateOne') => {
        let status = currentStatus === 'active' ? 'inactive' : 'active';
        let data = {
            status: status,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now(),
            }
        }
        if (options == 'updateOne') {
            return Model.updateOne({ _id: id }, data);
        } else if (options == 'updateMutiple') {
            data.status = currentStatus
            return Model.updateMany({ _id: { $in: id } }, data);
        }
    },

    changeOrdering: async (orderings, cids, options = '') => {

        let data = {
            ordering: parseInt(orderings),
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now(),
            }
        }
        return Model.updateOne({ _id: cids }, data);
    },

    changeType: async (id,idType, options = 'updateOne') => {
        let slugMenulv3;
        let menulv1;
        let menulv2;
        await menulv3Model.getItems(idType).then((itemMenulv3) => {
            slugMenulv3 = itemMenulv3.slug;
            nameMenulv3 = itemMenulv3.name;
            menulv1 = itemMenulv3.menulv1;
            menulv2 = itemMenulv3.menulv2;
        });
        let data = {
            menulv3:[idType,nameMenulv3,slugMenulv3],
            menulv1:menulv1,
            menulv2:menulv2,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now(),
            }
        }
        return Model.updateOne({ _id: id }, data);
    },

    deleteItems: async (id, options = 'deleteOne') => {

        if (options == 'deleteOne') {
            
            await Model.findById(id).then((item) => {
                fileHelper.remove(folderUpload,item.thumb);
            });
            return Model.deleteOne({ _id: id });
        } else if (options == 'deleteMutiple') {
            if (Array.isArray(id)) {
                for (index = 0;index<id.length;index++) {
                    await Model.findById(id[index]).then((item) => {
                        fileHelper.remove(folderUpload,item.thumb);
                    });
                }
            } else {
                await Model.findById(id).then((item) => {
                    fileHelper.remove(folderUpload,item.thumb);
                });
            }
            return Model.deleteMany({ _id: { $in: id } });
        }
    },

    saveItems: async (item, options = 'add') => {
        await menulv3Model.getItems(item.menulv3[0]).then((itemMenulv3) => {
            item.menulv3.pop();
            item.menulv3.push(itemMenulv3.name,itemMenulv3.slug);
            item.menulv1 = itemMenulv3.menulv1;
            item.menulv2 = itemMenulv3.menulv2;
        });
        if (options == 'add') {
            item.created = {
                user_id: 0,
                user_name: 'admin',
                time: Date.now(),
            };
            item.slug = convertToSlugHelper.convertToSlug(item.slug);
            return new Model(item).save();

        } else if (options == 'edit') {
            return Model.updateOne({ _id: item.id }, {
                name: item.name,
                status: item.status,
                special: item.special,
                ordering: parseInt(item.ordering),
                price: parseFloat(item.price),
                reduce_price: parseFloat(item.reduce_price),
                description: item.description,
                slug: convertToSlugHelper.convertToSlug(item.slug),
                thumb: item.thumb,
                menulv1: item.menulv1,
                menulv2: item.menulv2,
                menulv3: item.menulv3,
                modified: {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now(),
                }
            });
        } 
    },
}