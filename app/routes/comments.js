var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Notification = require('../models/notification');
var async = require('async');

router.post('/api/new', function(req, res, next) {
    if (!res.locals.user) return res.send({success: false, msg: '请先登录'});
    var comment = req.body;
    comment.author = res.locals.user.mongo_id;


    Comment.insertComment(comment, function(err, comment){
        if (err) return next(err);
        //res.setHeader('Content-Type', 'text/plain');
        //res.writeHead(200);
        console.log(req.body);
        var notification = {
            fromUserId: comment.author,
            toUserId: req.body.postAuthorId,
            postId: req.body.postId,
            content: '文章[' + req.body.postTitle + ']有新评论'
        };
        Notification.insertNotification(notification, function(err){
            if (err) return next(err);
            res.send({success: true, commentId: comment._id.toString()});
        });
    });
});

module.exports = router;