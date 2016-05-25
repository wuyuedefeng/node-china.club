var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var commentSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    markdown: String
},{
    timestamps: true
});

commentSchema.statics.insertComment = function(comment, cb){
    var commentEntity = new commentModel({author: comment.author, post: comment.postId, markdown: comment.markdown});
    commentEntity.save(function(err, data){
        return cb(err, data);
    });
};

commentSchema.statics.findComments = function(postId, cb){
    this.find({post: postId}).populate('author').exec(function(err, comments){
        cb(err, comments);
    })
};

//  model 方法
commentSchema.methods.showHandleCreatedAt = function(){
    var moment = require('moment');
    moment.locale('zh-CN');
    return moment(this.createdAt).fromNow();
};

var commentModel = mongoose.model('Comment', commentSchema);
module.exports = commentModel;