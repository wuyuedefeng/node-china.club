var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
router.post('/api/new', function(req, res, next) {
    if (!res.locals.user) return res.send({success: false, msg: '请先登录'});
    var comment = req.body;
    comment.author = res.locals.user.mongo_id;
    Comment.insertComment(comment, function(err, comment){
        if (err) return next(err);
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(200);
        res.end(comment._id.toString());
    });
});

module.exports = router;