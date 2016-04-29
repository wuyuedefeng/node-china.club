var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('golds/index', {
        title: '金价获取'
    });
});

module.exports = router;

