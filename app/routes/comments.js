var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Notification = require('../models/notification');
var async = require('async');

router.post('/api/new', function(req, res, next) {
    if (!res.locals.user) return res.send({success: false, msg: '请先登录'});
    var comment = req.body;
    comment.author = res.locals.user.mongo_id;

    if(comment.author == req.body.postAuthorId){
        res.send({success: true, commentId: comment._id.toString()});
    }else {
        Comment.insertComment(comment, function(err, comment){
            if (err) return next(err);
            //res.setHeader('Content-Type', 'text/plain');
            //res.writeHead(200);
            var notification = {
                author: req.body.postAuthorId,
                postId: req.body.postId,
                content: '收到文章[' + req.body.postTitle + ']的新评论'
            };
            Notification.insertNotification(notification, function(err){
                if (err) return next(err);
                res.send({success: true, commentId: comment._id.toString()});
            });
        });
    }
});

module.exports = router;