var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var NotificationSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: true },
    content: String
},{
    timestamps: true
});

NotificationSchema.statics.insertPost = function(notification, cb){
    var notificationEntity = new NotificationModel({author: notification.userId, isRead: false, content: notification.content});
    notificationEntity.save(function(err, data){
        return cb(err, data);
    });
};

NotificationSchema.statics.findUnreadNotifications = function(_id, cb){
    this.find({author: _id}).populate('author').exec(function(err, notifications){
        cb(err, notifications);
    });
};

var NotificationModel = mongoose.model('Notification', NotificationSchema);
module.exports = NotificationModel;