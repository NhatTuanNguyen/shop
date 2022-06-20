var Model = require(__path_schemas + 'feedbacks');

module.exports = {

    listItems: (limit) => {

        return Model
            .find({})
            .limit(limit)
            .sort({ time: 'desc' });
    },
    saveItems: (item) => {
        item.time = Date.now();
        return new Model(item).save();
    },
}