var express = require('express');
var router = express.Router();


//TODO:

router.get('/add', function(req, res, next) {
    res.render('contents/school/add', { title: '保育園追加' });
});
router.get('/edit', function(req, res, next) {
    res.render('contents/school/edit', { title: '保育園編集' });
});
router.get('/end', function(req, res, next) {
    res.render('contents/school/end', { title: '本登録完了' });
});
router.get('/kari', function(req, res, next) {
    res.render('contents/school/kari', { title: '仮登録完了' });
});

module.exports = router;