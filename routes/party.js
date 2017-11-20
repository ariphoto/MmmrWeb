var express = require('express');
var router = express.Router();

//TODO:


router.get('/add', function(req, res, next) {
    res.render('contents/party/add', { title: 'クラス追加' });
});
//TODO:
router.get('/edit', function(req, res, next) {
    res.render('contents/party/edit', { title: 'クラス編集' });
});
router.get('/list', function(req, res, next) {
    res.render('contents/party/list', { title: 'クラス一覧' });
});

module.exports = router;