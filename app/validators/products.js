const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 300 },
    ordering: { min: 0, max: 100 },
    status: { value: 'novalue' },
    special: { value: 'novalue' },
    menulv3: { value: 'novalue' },
    description: { min: 5, max: 20000 },
}

module.exports = {
   
    validator: (req, errUpload, taskCurrent) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_NOTEMPTY)
            .isNotEqual(options.status.value);

        // special
        req.checkBody('special', notify.ERROR_NOTEMPTY)
            .isNotEqual(options.special.value);
        
        // menulv3
        req.checkBody('menulv3', notify.ERROR_NOTEMPTY)
            .isNotEqual(options.menulv3.value);
            
        // Slug
        req.checkBody('slug', notify.ERROR_NOTEMPTY)
            .notEmpty(); 
        // price
        req.checkBody('price', notify.ERROR_NOTEMPTY)
            .notEmpty(); 
        // reduce_price
        req.checkBody('reduce_price', notify.ERROR_NOTEMPTY)
            .notEmpty(); 

        // description
        req.checkBody('description', util.format(notify.ERROR_NAME, options.description.min, options.description.max) )
            .isLength({ min: options.description.min, max: options.description.max });

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        if (errUpload) {
			if(errUpload.code == 'LIMIT_FILE_SIZE') {
				errUpload = notify.ERROR_FILE_LIMIT;
			};
			errors.push({param: 'thumb', msg: errUpload});
		}else {
			if(req.file == undefined && taskCurrent == "add"){
				errors.push({param: 'thumb', msg: notify.ERROR_FILE_REQUIRE});
			}
        }
        
        return errors;
    }
}