var Model = require(__path_schemas + 'banners');
var convertToSlugHelper = require(__path_helpers + 'conver-to-slug');
const fileHelper = require(__path_helpers + 'file');
const folderUpload = 'public/uploads/banners/';

module.exports = {
    listItems: (params) => {
        let objWhere = {};
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
        let find ={status: 'active'};
        let select = 'thumb';
        let sort = {ordering: 'asc'}
        let limit = 4;

        return Model.find(find).select(select).limit(limit).sort(sort);
    },

    getItems: (id) => {
        return Model.findById(id);
    },

    countItems: (params) => {
        let objWhere = {};
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

    saveItems: (item, options = 'add') => {

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
                ordering: parseInt(item.ordering),
                slug: convertToSlugHelper.convertToSlug(item.slug),
                thumb: item.thumb,
                modified: {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now(),
                }
            });
        }
    },
}