var aliyun = {
    config: {
        "accessKeyId": "H51KL93Jr9kGDfEn",
        "secretAccessKey": "ZNGXHi7DEjTh4DqvDr4cMF1JvBZqL8",
        // 根据你的 oss 实例所在地区选择填入
        // 杭州：http://oss-cn-hangzhou.aliyuncs.com
        // 北京：http://oss-cn-beijing.aliyuncs.com
        // 青岛：http://oss-cn-qingdao.aliyuncs.com
        // 深圳：http://oss-cn-shenzhen.aliyuncs.com
        // 香港：http://oss-cn-hongkong.aliyuncs.com
        // 注意：如果你是在 ECS 上连接 OSS，可以使用内网地址，速度快，没有带宽限制。
        // 杭州：http://oss-cn-hangzhou-internal.aliyuncs.com
        // 北京：http://oss-cn-beijing-internal.aliyuncs.com
        // 青岛：http://oss-cn-qingdao-internal.aliyuncs.com
        // 深圳：http://oss-cn-shenzhen-internal.aliyuncs.com
        // 香港：http://oss-cn-hongkong-internal.aliyuncs.com
        endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
        // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
        apiVersion: '2013-10-15',
        bucket: 'node-china'
    }
};

var aly = require('aliyun-sdk');
var oss = new aly.OSS({
    "accessKeyId": aliyun.config.accessKeyId,
    "secretAccessKey": aliyun.config.secretAccessKey,
    endpoint: aliyun.config.endpoint,
    // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
    apiVersion: aliyun.config.apiVersion
});

aliyun.OSS = oss;
// {fileName: , base64:}
aliyun.uploadFile = function(fileInfo, cb){
    var imageBuffer = decodeBase64Image(fileInfo.base64);
    if (!imageBuffer){
        cb(new Error('转换失败'));
        return false;
    }
    oss.putObject({
        Bucket: aliyun.config.bucket,
        Key: fileInfo.fileName,                 // 注意, Key 的值不能以 / 开头, 否则会返回错误.
        Body: imageBuffer.data,
        AccessControlAllowOrigin: '',
        ContentType: 'img/*',
        CacheControl: 'public',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
        ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
        ContentEncoding: '',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
        ServerSideEncryption: '',
        Expires:  new Date()                      // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
    },
    function (err, data) {
        if (err) {
            cb(err);

        }else {
            cb(null, data);
        }

    });
};


function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
    if (!matches){
        return new Error('no match');
    }
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

module.exports = aliyun;