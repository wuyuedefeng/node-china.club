var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Subject = require('../models/subject');
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect('/posts');

  //Post.searchPosts(req.query.searchTitle, req.query.category, req.query.tags && req.query.tags.split(','), 1, function(err, postObj){
  //  res.render('index', {
  //    title: 'nodeChina',
  //    posts: postObj.posts || []
  //  });
  //});

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

router.get('/ldjPrice', function(request, response, next){
  var http = require('http');
  http.get('http://www.bulliondesk.com/fmdatacache/?sym=XAU&fld=B&zz=319897461801&ts=3-Dec-1970+12%3A50:38', function(res){
    res.on("data", function(chunk) {
      var data = JSON.stringify(chunk.toString());
      response.json({data: data});
    }).on('error', function(e) {
      return next(e);
    });
  });


  //var superagent = require('superagent');
  //superagent.get('http://www.bulliondesk.com/fmdatacache/?sym=XAU&fld=B&zz=319897461801&ts=3-Dec-1970+12%3A50:38')
  //    .end(function (err, sres) {
  //      if (err) {
  //        return next(err);
  //      }
  //      response.json({data: JSON.stringify(sres.text)});
  //    });
});

module.exports = router;
