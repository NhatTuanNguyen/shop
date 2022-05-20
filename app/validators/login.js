const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    username: { min: 5, max: 30 },
    password: { min: 5, max: 30 },
}

module.exports = {
   
    validator: (req) => {
        // NAME
        req.checkBody('username', util.format(notify.ERROR_NAME, options.username.min, options.username.max) )
            .isLength({ min: options.username.min, max: options.username.max })

        // PASSWORD
        req.checkBody('password', util.format(notify.ERROR_NAME, options.password.min, options.password.max) )
            .isLength({ min: options.password.min, max: options.password.max })

    }
}