var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Subject = require('../models/subject');
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {

  Post.searchPosts(req.query.searchTitle, req.query.category, req.query.tags && req.query.tags.split(','), function(err, posts){
    res.render('index', {
      title: 'nodeChina',
      posts: posts || []
    });
  });

});


router.get('/goldPrice', function(request, response, next){
  var https = require('https');
  var options = {
    hostname: 'www.g-banker.com',
    path: '/info/price',
    method: 'POST',
    secure: true,
    headers: {
      'Connection' : 'keep-alive',
      'Content-Type': 'application/json;charset=UTF-8',
      'aw-tenant-code': 'q6T2GUtlXf/oOaiFwfiMFYWtMKveaH+19BCrxzRQvoc=',
      'Access-Control-Allow-Origin': '*'
    }
  };
  var req = https.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function(){
      if (data){
        response.json(JSON.parse(data));
      }
    });
  });
  req.on( 'error' ,  function (e) {
    return next(e);
  });
  req.end();
});

module.exports = router;
