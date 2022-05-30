var Model = require(__path_schemas + 'menulv3');
var menulv2Model = require(__path_models + 'menulv2');
var schemasProductsModel = require(__path_schemas + 'products');
var convertToSlugHelper = require(__path_helpers + 'conver-to-slug');

module.exports = {
    listItems: (params) => {
        let objWhere = {};
        if (params.categoryId !== "novalue") objWhere.menulv2 = params.categoryId;
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
        let select = 'id name slug menulv2';
        let sort = {ordering: 'asc'}

        return Model.find(find).select(select).sort(sort);
    },

    listItemsInSelecbox: () => {
        return Model.find({}, { name: 1, _id: 1,menulv2:1,menulv1:1 }).sort({menulv1:'asc'});
    },

    getItems: (id) => {
        return Model.findById(id);
    },

    countItems: (params) => {
        let objWhere = {};
        if (params.categoryId !== "novalue") objWhere.menulv2 = params.categoryId;
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

    changeType: async (nameSelect, id,idType, options = 'updateOne') => {
        let slugMenulv2;
        let menulv1;
        await menulv2Model.getItems(idType).then((itemMenulv2) => {
            slugMenulv2 = itemMenulv2.slug;
            menulv1 = itemMenulv2.menulv1;
        });
        let data = {
            menulv2:[idType,nameSelect,slugMenulv2],
            menulv1:menulv1,
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

    saveItems: async (item, options = 'add') => {
        await menulv2Model.getItems(item.menulv2[0]).then((itemMenulv2) => {
            item.menulv2.push(itemMenulv2.slug);
            item.menulv1 = itemMenulv2.menulv1;
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
            await schemasProductsModel.updateMany({menulv3:item.id},{menulv3:[item.id,item.name,convertToSlugHelper.convertToSlug(item.slug)]});
            return Model.updateOne({ _id: item.id }, {
                name: item.name,
                status: item.status,
                ordering: parseInt(item.ordering),
                menulv2: item.menulv2,
                menulv1: item.menulv1,
                slug: convertToSlugHelper.convertToSlug(item.slug),
                modified: {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now(),
                }
            });
        }
    },
}