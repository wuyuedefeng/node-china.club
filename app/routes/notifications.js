var express = require('express');
var router = express.Router();
var Notification = require('../models/notification');

router.get('/api/unread', function(req, res, next) {
    if (!res.locals.user) return res.send({success: false, msg: '请先登录'});
    Notification.findUnreadNotifications(res.locals.user.mongo_id, function(err, notifications){
        res.send({success: true, notifictions: notifications});
    });

});

module.exports = router;