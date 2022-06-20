const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    ordering: { min: 0, max: 100 },
    status: { value: 'novalue' },
}

module.exports = {
   
    validator: (req) => {
        // NAME
        req.checkBody('name',notify.ERROR_NOTEMPTY)
            .notEmpty(); 

        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});

        // NAME
        req.checkBody('icon',notify.ERROR_NOTEMPTY)
            .notEmpty(); 

        
        // STATUS
        req.checkBody('status', notify.ERROR_NOTEMPTY)
            .isNotEqual(options.status.value);

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        return errors;
    }
}