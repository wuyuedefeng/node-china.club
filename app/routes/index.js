var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Subject = require('../models/subject');
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {

  async.parallel({
    subjects: function (callback) {
      Subject.getAll(function (err, subjects) {
        callback(err, subjects);
      });
    },
    posts: function (callback) {
      Post.findPosts(0, 0, 0, function(err, posts){
        callback(err, posts);
      });
    }
  }, function(err, obj){
    if (err) return next(err);

    res.render('index', {
      title: 'nodeChina',
      posts: obj.posts || [],
      subjects: obj.subjects
    });

  });
});


router.get('/goldPrice', function(request, response, next){
  var http = require('https');
  var options = {
    hostname: 'www.g-banker.com',
    path: '/info/price',
    method: 'POST',
    secure: true,
    headers: {
      'Connection' : 'keep-alive',
      'Content-Type': 'application/json;charset=UTF-8',
      'aw-tenant-code': 'q6T2GUtlXf/oOaiFwfiMFYWtMKveaH+19BCrxzRQvoc='
    }
  };
  var req = http.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function(){
      response.json(JSON.parse(data));
    });
  });
  req.end();
});

module.exports = router;
