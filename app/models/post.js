var User = require('./user');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment');
moment.locale('zh-CN');

var Schema = mongoose.Schema;
var postSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    category: String,
    tags: [String],
    markdown: String,
    browseCount: {type: Number, default: 0}
},{
    timestamps: true
});
postSchema.pre('save', function(next) {
    next();
});


postSchema.statics.insertPost = function(post, cb){
    var postEntity = new postModel({author: post.userId, title: post.title, category: post.category, tags: post["tags[]"], markdown: post.markdown});
    postEntity.save(function(err, data){
        return cb(err, data);
    });
};

postSchema.statics.findPosts = function(pageNumber, limit, searchText, cb){
    pageNumber = pageNumber || 1;
    limit = limit || 20;
    this.find({}, {}, {skip: limit*(pageNumber-1), limit: limit, sort:{ createdAt: -1}}).populate('author').exec(function(err, posts){
            cb(err, posts);
    })
};

postSchema.statics.searchPosts = function(title, category, tags, page, cb){
    var searchObj = {
        title: {$regex: title, $options:'i'},
        category: category,
        tags: {$in: tags}
    };
    if (!title) delete searchObj["title"];
    if (!category) delete searchObj["category"];
    if (!tags) delete searchObj["tags"];
    var that = this;
    async.parallel({
        posts: function (callback) {
            that.find(searchObj, {}, {skip: (page -1)*20 , limit: 20, sort:{ createdAt: -1}}).populate('author').exec(function(err, posts){
                callback(err, posts);
            })
        },
        allCount: function(callback){
            that.count(searchObj, function(err, count){
                callback(err, count);
            });
        }
    }, function(err, obj){
        if (err) return cb(err);
        cb(err, obj);
    });



};

postSchema.statics.findById = function(_id, cb){
    this.findOne({_id: _id}).populate('author').exec(function(err, post){
        cb(err, post);
    });
};


//  model 方法
postSchema.methods.showHandleCreatedAt = function(){
    return moment(this.createdAt).fromNow();
};

var postModel = mongoose.model('Post', postSchema);
module.exports = postModel;