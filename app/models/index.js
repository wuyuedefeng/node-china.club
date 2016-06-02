var config = require('../../config');
// 启动mongo
var mongoose = require('mongoose');

var User = require('./user');
var Subject = require('./subject');
var Post = require('./post');
exports.User    = User;
exports.Post    = Post;
exports.Subject = Subject;

mongoose.connect(config.db, function(err){
    if (err) {
        console.log(err.message);
        process.exit(1);
    }else {
        console.info('link MongoDB success!!!');
        var Subject = require('./subject.js');
        console.log(Subject.initData());

    }
});

