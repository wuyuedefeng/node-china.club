var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var NotificationSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: true },
    postId: String,
    content: String
},{
    timestamps: true
});

NotificationSchema.statics.insertNotification = function(notification, cb){
    var notificationEntity = new NotificationModel({author: notification.userId, postId: notification.postId, isRead: false, content: notification.content});
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
    this.find({author: _id, isRead: false}).populate('author').exec(function(err, notifications){
        cb(err, notifications);
    });
};

var NotificationModel = mongoose.model('Notification', NotificationSchema);
module.exports = NotificationModel;