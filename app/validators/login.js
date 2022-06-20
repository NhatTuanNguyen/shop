const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    email: { min: 1, max: 30 },
    password: { min: 1, max: 30 },
}

module.exports = {
   
    validator: (req) => {
        // NAME
        req.checkBody('email', util.format(notify.ERROR_NAME, options.email.min, options.email.max) )
            .isLength({ min: options.email.min, max: options.email.max })

        // PASSWORD
        req.checkBody('password', util.format(notify.ERROR_NAME, options.password.min, options.password.max) )
            .isLength({ min: options.password.min, max: options.password.max })
        

    }
}