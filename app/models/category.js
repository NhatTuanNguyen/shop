var Model = require(__path_schemas + 'category');
var convertToSlugHelper = require(__path_helpers + 'conver-to-slug');

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
        let find ={};
        let select = 'name';
        let sort = {};
        let limit = 10;

        if (options.task == 'itemsSpecial') {
            find = {status: 'active'};
            sort = {ordering: 'asc'}
        } else if (options.task == 'itemsCategory') {
            select = 'name slug id category';
            find = {status: 'active'};
            sort = {ordering: 'asc'}
        }else if (options.task == 'itemsCategoryParent') {
            select = 'name slug';
            find = {status: 'active','category.id':1};
            sort = {ordering: 'asc'}
        } else if (options.task == 'category') {
            find = {status: 'active'};
            find = {_id:params.id}
        }
        return Model.find(find).select(select).limit(limit).sort(sort);
    },

    listItemsInSelecbox: () => {
        return Model.find({}, { name: 1, _id: 1 });
    },

    listItemsCategoryParent: () => {
        return Model.find({'category.id':1}, { name: 1, _id: 1 });
    },

    listItemsCategoryArticle: () => {
        return Model.find({'category.id':'627bd870350f5cf79affc717'}, { name: 1, _id: 1 });
    },

    getItems: (id) => {
        return Model.findById(id);
    },

    getItemsFromSlug: (slug) => {
        return Model.find({ slug: slug});
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

    changeType: (nameSelect, id,idType, options = 'updateOne') => {
        let data = {
            category: {
                id: idType,
                name: nameSelect,
            },
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now(),
            }
        }
        return Model.updateOne({ _id: id }, data);
    },

    deleteItems: (id, options = 'deleteOne') => {

        if (options == 'deleteOne') {
            return Model.deleteOne({ _id: id });
        } else if (options == 'deleteMutiple') {
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
            item.category = {
                id: item.category_id,
                name: item.category_name,
            };
            item.slug = convertToSlugHelper.convertToSlug(item.slug);
            return new Model(item).save();

        } else if (options == 'edit') {
            return Model.updateOne({ _id: item.id }, {
                name: item.name,
                status: item.status,
                ordering: parseInt(item.ordering),
                content: item.content,
                slug: convertToSlugHelper.convertToSlug(item.slug),
                category: {
                    id: item.category_id,
                    name: item.category_name,
                },
                modified: {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now(),
                }
            });
        }
    },
}