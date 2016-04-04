var express = require('express');
var router = express.Router();
var Post = require('../models/post');
/* GET home page. */
router.get('/', function(req, res, next) {

  Post.findPosts(0, 0, 0, function(err, posts){
    console.log(posts);
    res.render('index', {
      title: 'nodeChina',
      posts: posts || []
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
