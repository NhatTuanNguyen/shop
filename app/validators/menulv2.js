const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 1, max: 18 },
    ordering: { min: 0},
    status: { value: 'novalue' },
}

module.exports = {
   
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max });

        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min))
            .isInt({gt: options.ordering.min});
        
        // Slug
        req.checkBody('slug', notify.ERROR_GROUPACP)
            .notEmpty();    

        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        // CATEGORY
        req.checkBody('menulv1[0]', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);
        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
       
        return errors;
    }
}