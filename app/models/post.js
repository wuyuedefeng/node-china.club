var User = require('./user');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var postSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    category: String,
    tags: [String],
    markdown: String,
    voters: [{type: String, unique: true, default: []}],
    voterCount: {type: String, default: 0}
},{
    timestamps: true
});
postSchema.pre('save', function(next) {
    this.voterCount = this.voters.length;
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
    this.find({}, {voters: 0}, {skip: limit*(pageNumber-1), limit: limit, sort:{ createdAt: -1}}).populate('author').exec(function(err, posts){
            cb(err, posts);
    })
};

postSchema.statics.searchPosts = function(title, category, tags, cb){
    var searchObj = {
        title: {$regex: title, $options:'i'},
        category: category,
        tags: {$in: tags}
    };
    if (!title) delete searchObj["title"];
    if (!category) delete searchObj["category"];
    if (!tags) delete searchObj["tags"];
    this.find(searchObj, {voters: 0}, {skip: 0, limit: 20, sort:{ createdAt: -1}}).populate('author').exec(function(err, posts){
        cb(err, posts);
    })
};

postSchema.statics.findById = function(_id, cb){
    this.findOne({_id: _id}).populate('author').exec(function(err, post){
        cb(err, post);
    });
};

var postModel = mongoose.model('Post', postSchema);
module.exports = postModel;