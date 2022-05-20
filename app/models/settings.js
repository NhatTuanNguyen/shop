var Model = require(__path_schemas + 'settings');

module.exports = {
    getItem: () => {
        return Model.find({})
    },

    saveItems: (item, options = 'add') => {

        if (options == 'add') {
            item.created = {
                user_id: 0,
                user_name: 'admin',
                time: Date.now(),
            };
            return new Model(item).save();

        } else if (options == 'edit') {
            return Model.updateOne({ _id: item.id }, {
                logo: item.logo,
                media: item.media,
                copyright: item.copyright,
                info: item.info,
                map: item.map,
                email: item.email,
                modified: {
                    user_id: 0,
                    user_name: 'admin',
                    time: Date.now(),
                }
            });
        }
    },
}