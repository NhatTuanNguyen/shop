var Model = require(__path_schemas + 'orders');

module.exports = {

    listItems: (params) => {
        let objWhere = {};
        if (params.orderStatusId !== "novalue") objWhere['status.id'] = params.orderStatusId;
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

    getItemsByOrderId: (id) => {
        return Model.find({order_id: id});
    },

    getItemsByIdUser: (id) => {
        return Model.find({user_id: id});
    },

    countItems: (params) => {
        let objWhere = {};
        if (params.currentStatus !== 'all' && params.currentStatus !== undefined) objWhere.status = params.currentStatus;
        if (params.keyword !== "" && params.keyword !== undefined) objWhere.name = new RegExp(params.keyword, 'i');
        return Model.count(objWhere)
    },

    // changeStatus: (currentStatus, id, options = 'updateOne') => {
    //     let status = currentStatus === 'active' ? 'inactive' : 'active';
    //     let data = {
    //         status: status,
    //         modified: {
    //             user_id: 0,
    //             user_name: 'admin',
    //             time: Date.now(),
    //         }
    //     }
    //     if (options == 'updateOne') {
    //         return Model.updateOne({ _id: id }, data);
    //     } else if (options == 'updateMutiple') {
    //         data.status = currentStatus
    //         return Model.updateMany({ _id: { $in: id } }, data);
    //     }
    // },

    changeType: (nameSelect, id,idType, options = 'updateOne') => {
        let data = {
            status: {
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
            item.time = Date.now();
            return new Model(item).save();

        } 
    },
}