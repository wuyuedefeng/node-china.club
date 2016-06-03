var express = require('express');
var router = express.Router();
var Subject = require('../models/subject');
var Post = require('../models/post');
var Comment = require('../models/comment');
var Notification = require('../models/notification');
var async = require('async');
/* GET users listing. */
router.get('/', function(req, res, next) {

    req.query.page = req.query.page || 1;
    async.parallel({
        subjects: function (callback) {
            Subject.getAll(function (err, subjects) {
                callback(err, subjects);
            });
        },
        postInfo: function (callback) {
            Post.searchPosts(req.query.searchTitle, req.query.category, req.query.tags && req.query.tags.split(','), req.query.page, function(err, posts){
                callback(err, posts);
            });
        }
    }, function(err, obj){
        if (err) return next(err);

        res.render('posts/index', {
            title: '文章列表',
            posts: obj.postInfo.posts || [],
            allCount: obj.postInfo.allCount,
            nowPage: +req.query.page,
            subjects: obj.subjects,
            searchTitle: req.query.searchTitle || '',
            searchCategory: req.query.category || '',
            searchTags: req.query.tags && req.query.tags.split(',') || [],
        });

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

    if (req.query.notificationId){
        Notification.updateUnreadToRead(req.query.notificationId, function(err){});
    }

    async.parallel({
        post: function (callback) {

            Post.findById(_id, function(err, post){
                if (err) return next(err);
                post.browseCount = post.browseCount || 0;
                Post.update({_id: _id},{$set:{browseCount: post.browseCount + 1}}, function(err){
                    callback(err, post);
                });
            });
        },
        comments: function (callback) {
            Comment.findComments(_id, function(err, comments){
                callback(err, comments);
            });
        }
    }, function(err, obj){
        if (err) return next(err);

        if (err) return next(err);
        res.render('posts/show', {
            title: obj.post.title,
            post: obj.post,
            comments: obj.comments
        });
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

// post 编辑数据
router.post('/api/edit/:id', function(req, res, next){

    var _id = req.params.id;
    if (!res.locals.user) return res.send({success: false, msg: '请先登录'});
    var post = req.body;
    Post.update({_id: _id, author: res.locals.user.mongo_id},{title: post.title, category: post.category, tags: post["tags[]"], markdown: post.markdown}, function(err){
        if (err) return next(err);
        res.send({success: true, msg: '更新成功'});
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
