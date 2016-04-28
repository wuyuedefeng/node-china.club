var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('golds/index', {
        title: '金价获取'
    });
});

module.exports = router;


a = {
    text: 'XAU#1255.4 \r28-Apr-2016 12:01:47',
        body: {},
    files: {},
    buffered: true,
        headers:
    { server: 'nginx',
        date: 'Thu, 28 Apr 2016 11:01:49 GMT',
        'content-type': 'text/html',
        'transfer-encoding': 'chunked',
        connection: 'close',
        'x-powered-by': 'ASP.NET',
        expires: 'Thu, 28 Apr 2016 11:01:50 GMT',
        'cache-control': 'max-age=1',
        'x-served-by': 'cms2-1',
        'content-encoding': 'gzip' },
    header:
    { server: 'nginx',
        date: 'Thu, 28 Apr 2016 11:01:49 GMT',
        'content-type': 'text/html',
        'transfer-encoding': 'chunked',
        connection: 'close',
        'x-powered-by': 'ASP.NET',
        expires: 'Thu, 28 Apr 2016 11:01:50 GMT',
        'cache-control': 'max-age=1',
        'x-served-by': 'cms2-1',
        'content-encoding': 'gzip' },
    statusCode: 200,
        status: 200,
    statusType: 2,
    info: false,
    ok: true
}

