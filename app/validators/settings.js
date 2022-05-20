const util  = require('util');
const notify= require(__path_configs + 'notify');

// const options = {
//     name: { min: 5, max: 30 },
//     ordering: { min: 0, max: 100 },
//     status: { value: 'novalue' },
//     content: { min: 5, max: 200 },
// }

module.exports = {
   
    validator: (req,errUpload,taskCurrent) => {
        // NAME
        req.checkBody('copyright', notify.ERROR_NOTEMPTY ).notEmpty();
        req.checkBody('info', notify.ERROR_NOTEMPTY ).notEmpty();
        req.checkBody('map', notify.ERROR_NOTEMPTY ).notEmpty();
        req.checkBody('email', notify.ERROR_NOTEMPTY ).notEmpty();
        req.checkBody('media[facebook]', notify.ERROR_NOTEMPTY ).notEmpty();
        req.checkBody('media[twitter]', notify.ERROR_NOTEMPTY ).notEmpty();
        req.checkBody('media[youtube]', notify.ERROR_NOTEMPTY ).notEmpty();
        req.checkBody('media[instagram]', notify.ERROR_NOTEMPTY ).notEmpty();

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        if (errUpload) {
			if(errUpload.code == 'LIMIT_FILE_SIZE') {
				errUpload = notify.ERROR_FILE_LIMIT;
			};
			errors.push({param: 'logo', msg: errUpload});
		}else {
			if(req.file == undefined && taskCurrent == "add"){
				errors.push({param: 'logo', msg: notify.ERROR_FILE_REQUIRE});
			}
        }
        
        return errors;
    }
}