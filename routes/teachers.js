var express = require('express');
var router = express.Router();

//TODO:


router.get('/add', function(req, res, next) {
    res.render('contents/teachers/add', { title: '保育士追加' });
});
router.get('/edit', function(req, res, next) {
    res.render('contents/teachers/edit', { title: '保育士編集' });
});
router.get('/list', function(req, res, next) {
    res.render('contents/teachers/list', { title: '保育士一覧' });
});
module.exports = router;