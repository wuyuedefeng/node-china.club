var config = require('../config');
var Model = require('./models');
var githubConfig = require('./lib/github/config');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes = require('./routes/index');
var github = require('./lib/github/github');
var users = require('./routes/users');
var golds = require('./routes/golds');
var user = require('./lib/middleware/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '500kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(cookieSession({
  name: config.session.name,
  keys: config.session.keys
}));
// before route set
app.use(function(req, res, next) {
  res.locals.authVisitUrl = githubConfig.authVisitUrl;
  next();
});
app.use(user);
app.use('/', routes);
app.use('/github', github);
app.use('/users', users);
app.use('/golds', golds);
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/notifications', require('./routes/notifications'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

app.set("env" , config.env);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


