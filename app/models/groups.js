var Model = require(__path_schemas + 'groups');

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

    listItemsInSelecbox: () => {
        return Model.find({}, { name: 1, _id: 1 });
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

    changeGroupAcp: (currentGroupAcp, id, options = '') => {
        let groupAcp = currentGroupAcp === 'yes' ? 'no' : 'yes';
        let data = {
            group_acp: groupAcp,
            modified: {
                user_id: 0,
                user_name: 'admin',
                time: Date.now(),
            }
        }
        
        return Model.updateOne({ _id: id }, data)
        
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
            }
            return new Model(item).save();

        } else if (options == 'edit') {
            return Model.updateOne({ _id: item.id }, {
                name: item.name,
                status: item.status,
                ordering: parseInt(item.ordering),
                content: item.content,
                group_acp:item.group_acp,
                modified: {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now(),
                }
            });
        }
    },
}