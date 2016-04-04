var express = require('express');
var router = express.Router();
var Subject = require('../models/subject');
var Post = require('../models/post');
var async = require('async');
/* GET users listing. */
router.get('/', function(req, res, next) {
    Post.findPosts(0, 0, 0, function(err, posts){
        console.log(posts);
        res.render('posts', {
            title: '文章列表',
            posts: posts || []
        })
    });

});

router.get('/new', function(req, res, next){

    if (!res.locals.user){
        res.send('请先登录');
    }else if (res.locals.user.name != 'wuyuedefeng'){
        res.send('权限不足');
    }

    Subject.getAll(function(err, subjects){
        if (err) return next(err);
        console.log('data');
        console.log(subjects);
        res.render('posts/new', {
            title: '新增话题',
            subjects: subjects
        })
    });
});

router.get('/show/:id', function(req, res, next){
    var _id = req.params.id;
    Post.findById(_id, function(err, post){
       res.render('posts/show', {
           title: '话题详情',
           post: post
       })
    });
});

router.get('/edit/:id', function(req, res, next){
    var _id = req.params.id;
    async.parallel({
        subjects: function (callback) {
            Subject.getAll(function (err, subjects) {
                callback(err, subjects);
            });
        },
        post: function (callback) {
            Post.findById(_id, function (err, post) {
                callback(err, post);
            });
        }
    }, function(err, obj){
        if (err) return next(err);

        if (!obj.post || obj.post.author._id.toString() != res.locals.user.mongo_id){
            res.send('权限不足');
        }

        res.render('posts/edit', {
            title: '话题编辑',
            post: obj.post,
            subjects: obj.subjects
        })

    });

});

// api
router.get('/api/category/tags', function(req, res, next){
    var categoryKey = req.query.category_key;
    if (categoryKey){
        Subject.getTagsWithCategoryKey(categoryKey, function(err, data){
            if (err) return next(err);
            res.send(data);
        })
    }
});
// post 添加数据
router.post('/api/new', function(req, res, next){
    var post = req.body;
    post.userId = res.locals.user.mongo_id;
    Post.insertPost(post, function(err, post){
        if (err) return next(err);
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(200);
        res.end(post._id.toString());
    });

});
// delete 删除数据
router.delete('/api/delete/:id', function(req, res, next){
    var _id = req.params.id;
    if (!res.locals.user) return res.send({success: false, msg: '请先登录'});
    Post.findById(_id, function (err, post) {
        if (err) return next(err);
        if (res.locals.user.mongo_id == post.author._id.toString()){
            post.remove(function(err){
                if (err) return res.send({success: false, msg: '操作失败'});
                return res.send({success: true, msg: '删除成功'});
            });
        }else {
            res.send({success: false, msg: '无权限'});
        }
    });

});


module.exports = router;
