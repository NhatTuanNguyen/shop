var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const pathConfig = require('./path');

const validator = require('express-validator');

// define path
global.__base = __dirname + '/';
global.__path_app = __base + pathConfig.folder_app + '/';
global.__path_configs = __path_app + pathConfig.folder_configs + '/';
global.__path_helpers = __path_app + pathConfig.folder_helpers + '/';
global.__path_routes = __path_app + pathConfig.folder_routes + '/';
global.__path_schemas = __path_app + pathConfig.folder_schemas + '/';
global.__path_validators = __path_app + pathConfig.folder_validators + '/';

global.__path_views = __path_app + pathConfig.folder_views + '/';
global.__path_views_admin = __path_views + pathConfig.folder_module_admin + '/';
global.__path_views_frontend = __path_views + pathConfig.folder_module_frontend + '/';

global.__path_models = __path_app + pathConfig.folder_models + '/';
global.__path_middleware = __path_app + pathConfig.folder_middleware + '/';
global.folder_public = __base + pathConfig.folder_public + '/';
global.folder_uploads = folder_public + pathConfig.folder_uploads + '/';

var systemConfig = require(__path_configs + 'system');

var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('express-flash-notification');
const session = require('express-session');
var moment = require('moment');  


// connect mongodb
main().catch(err => console.log('err'));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/shop');
  console.log('connect success');
}

var app = express();
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{ 
    maxAge:5*60*1000
  }
}));

require(__path_configs + 'passport')(passport);
app.use(passport.initialize())
app.use(passport.session())

app.use(flash(app,{
  viewName:__path_views_admin + 'flash',
}));

app.use(validator({
  customValidators: {
    isNotEqual: (value1, value2) => {
      return value1!==value2;
    }
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', __path_views_admin + 'backend');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.systemConfig = systemConfig;
app.locals.moment = moment;

app.use('/', require(__path_routes + 'frontend/index'));
app.use(`/${systemConfig.prefixAdmin}`, require(__path_routes + 'backend/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use( async function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if (systemConfig.env == 'dev') {
    res.status(err.status || 500);
    res.render(__path_views_admin + 'pages/error', { pageTitle: 'Page Not Found' });
  } else if (systemConfig.env == 'production') {
    res.status(err.status || 500);

    // Category
    // await categoryModel.listItemsFrontend(null, { task: 'itemsCategory' }).then((items) => {
    //   itemsCategory = items
    // });

    res.render(__path_views_blog + 'pages/error', {
      pageTitle: 'Page Not Found',
      top_post:false,
      layout: false,
      // itemsCategory,
    });
  }
});

module.exports = app;
