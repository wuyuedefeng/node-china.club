var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var NotificationSchema = new mongoose.Schema({
    fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
    toUser: { type: Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    content: String
},{
    timestamps: true
});

NotificationSchema.statics.insertNotification = function(notification, cb){
    var notificationEntity = new NotificationModel({fromUser: notification.fromUserId, toUser: notification.toUserId , post: notification.postId, isRead: false, content: notification.content});
    notificationEntity.save(function(err, data){
        return cb(err, data);
    });
};

NotificationSchema.statics.updateUnreadToRead = function(_id, cb){
    this.update({_id: _id}, {$set: {isRead: true}}, function(err){
        cb(err);
    });
};



NotificationSchema.statics.findUnreadNotifications = function(_id, cb){
    this.find({toUser: _id, isRead: false}).populate('fromUser').exec(function(err, notifications){
        cb(err, notifications);
    });
};

var NotificationModel = mongoose.model('Notification', NotificationSchema);
module.exports = NotificationModel;