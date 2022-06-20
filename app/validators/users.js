const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 30 },
    ordering: { min: 0, max: 100 },
    status: { value: 'novalue' },
    group: { value: 'novalue' },
    content: { min: 5, max: 200 },
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
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        // GROUP
        req.checkBody('group_id', notify.ERROR_GROUP)
            .isNotEqual(options.group.value);

        // emal
        req.checkBody('email', notify.ERROR_NOTEMPTY)
            .notEmpty(); 
        // phone
        req.checkBody('phone', notify.ERROR_NOTEMPTY)
            .notEmpty()
        // password
        req.checkBody('email', notify.ERROR_NOTEMPTY)
            .notEmpty()

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        

		if (errUpload) {
			if(errUpload.code == 'LIMIT_FILE_SIZE') {
				errUpload = notify.ERROR_FILE_LIMIT;
			};
			errors.push({param: 'avatar', msg: errUpload});
		}else {
			if(req.file == undefined && taskCurrent == "add"){
				errors.push({param: 'avatar', msg: notify.ERROR_FILE_REQUIRE});
			}
        }
        
        return errors;
    }
}