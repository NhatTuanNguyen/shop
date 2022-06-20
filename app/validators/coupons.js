const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 1, max: 18 },
    novalue: { value: 'novalue' },
}

module.exports = {
   
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max });

        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.novalue.value);

        // STATUS
        req.checkBody('type', notify.ERROR_STATUS)
            .isNotEqual(options.novalue.value);
        // amount
        req.checkBody('amount', notify.ERROR_NOTEMPTY)
            .notEmpty(); 
        // Slug
        req.checkBody('discount', notify.ERROR_NOTEMPTY)
            .notEmpty(); 
        // Slug
        req.checkBody('min_price', notify.ERROR_NOTEMPTY)
            .notEmpty(); 
        
        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
       
        return errors;
    }
}