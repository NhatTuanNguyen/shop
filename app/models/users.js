var Model = require(__path_schemas + 'users');
const fileHelper = require(__path_helpers + 'file');
var crypto = require('crypto');

module.exports = {
    listItems: (params) => {

        let objWhere = {};
        if (params.groupId !== "novalue") objWhere['group.id'] = params.groupId;
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

    getItems: (id) => {
        return Model.findById(id);
    },

    getByEmail: (email,options=null) => {
        if(options == null) {
            return Model.find({status: 'active',email: email})
                        .select('email password');
        }
    },

    countItems: (params) => {
        let objWhere = {};
        if (params.groupId !== "novalue" && params.groupId !== undefined) objWhere['group.id'] = params.groupId;
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
            group: {
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

    deleteItems: async (id, options = 'deleteOne') => {

        if (options == 'deleteOne') {
            
            await Model.findById(id).then((item) => {
                fileHelper.remove('public/uploads/users/',item.avatar);
            });
            return Model.deleteOne({ _id: id });
        } else if (options == 'deleteMutiple') {
            if (Array.isArray(id)) {
                for (index = 0;index<id.length;index++) {
                    await Model.findById(id[index]).then((item) => {
                        fileHelper.remove('public/uploads/users/',item.avatar);
                    });
                }
            } else {
                await Model.findById(id).then((item) => {
                    fileHelper.remove('public/uploads/users/',item.avatar);
                });
            }
            return Model.deleteMany({ _id: { $in: id } });
        }
    },

    saveItems: (item, options = 'add') => {
        switch (options){
            case 'add':
                item.password = crypto.createHash('md5').update(item.password).digest("hex");
                item.created = {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now(),
                };
                item.group = {
                    id: item.group_id,
                    name: item.group_name,
                };
                return new Model(item).save();
            case 'edit':
                return Model.updateOne({ _id: item.id }, {
                    name: item.name,
                    email: item.email,
                    // password: crypto.createHash('md5').update(item.password).digest("hex"),
                    status: item.status,
                    ordering: parseInt(item.ordering),
                    phone: item.phone,
                    avatar: item.avatar,
                    group: {
                        id: item.group_id,
                        name: item.group_name,
                    },
                    modified: {
                        user_id: 0,
                        user_name: 'admin',
                        time: Date.now(),
                    }
                });
            case 'signup':
                item.password = crypto.createHash('md5').update(item.password).digest("hex");
                item.status='active';
                item.ordering = 1;
                item.created = {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now(),
                };
                item.group = {
                    id: '628f589609238397d2a14482',
                    name: 'public',
                };
                return new Model(item).save();
            case 'changeGroupName':
                return Model.updateMany({ 'group.id': item.id }, {
        
                    group: {
                        id: item.id,
                        name: item.name,
                    },
                    modified: {
                        user_id: 0,
                        user_name: 'admin',
                        time: Date.now(),
                    }
                });
            case 'profile':
                return Model.updateOne({ _id: item.id }, {
                    name: item.name,
                    avatar: item.avatar,
                    phone: item.phone,
                    city: item.city,
                    district: item.district,
                    ward: item.ward,
                    address: item.address,
                    modified: {
                        user_id: 0,
                        user_name: 'admin',
                        time: Date.now(),
                    }
                });
        }

        // if (options == 'add') {
        //     item.password = crypto.createHash('md5').update(item.password).digest("hex");
        //     item.created = {
        //         user_id: 0,
        //         user_name: 'admin',
        //         time: Date.now(),
        //     };
        //     item.group = {
        //         id: item.group_id,
        //         name: item.group_name,
        //     };
        //     return new Model(item).save();

        // } else if (options == 'edit') {
        //     return Model.updateOne({ _id: item.id }, {
        //         name: item.name,
        //         email: item.email,
        //         password: crypto.createHash('md5').update(item.password).digest("hex"),
        //         status: item.status,
        //         ordering: parseInt(item.ordering),
        //         phone: item.phone,
        //         avatar: item.avatar,
        //         group: {
        //             id: item.group_id,
        //             name: item.group_name,
        //         },
        //         modified: {
        //             user_id: 0,
        //             user_name: 'admin',
        //             time: Date.now(),
        //         }
        //     });
        // } else if (options == 'signup') {
            
        //     item.password = crypto.createHash('md5').update(item.password).digest("hex");
        //     item.status='active';
        //     item.ordering = 1;
        //     item.created = {
        //         user_id: 0,
        //         user_name: 'admin',
        //         time: Date.now(),
        //     };
        //     item.group = {
        //         id: '628f589609238397d2a14482',
        //         name: 'public',
        //     };
        //     return new Model(item).save();

        // } else if (options == 'changeGroupName') {
        //     return Model.updateMany({ 'group.id': item.id }, {

        //         group: {
        //             id: item.id,
        //             name: item.name,
        //         },
        //         modified: {
        //             user_id: 0,
        //             user_name: 'admin',
        //             time: Date.now(),
        //         }
        //     });
        // }
    },
}