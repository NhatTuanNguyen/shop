var Model = require(__path_schemas + 'feedbacks');

module.exports = {

    listItems: (limit) => {

        return Model
            .find({})
            .limit(limit)
            .sort({ createdTime: 'desc' });
    },
    saveItems: (item) => {
        item.createdTime = Date.now();
        return new Model(item).save();
    },
}