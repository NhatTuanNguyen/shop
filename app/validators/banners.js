const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 18 },
    title: { min: 5, max: 45 },
    description: { min: 30, max: 100 },
    ordering: { min: 0},
    status: { value: 'novalue' },
    style: { value: 'novalue' },
}

module.exports = {
   
    validator: (req, errUpload, taskCurrent) => {
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