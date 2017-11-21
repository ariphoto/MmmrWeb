var express = require('express');
var router = express.Router();

//TODO:


router.get('/edit', function(req, res, next) {
    res.render('forgotPassword/edit', { title: '新規パスワード入力' });
    //pugの参照
});

router.get('/end', function(req, res, next) {
    res.render('forgotPassword/end', { title: '変更完了' });
});

router.get('/inputAddress', function(req, res, next) {
    res.render('forgotPassword/inputAddress', { title: 'メールアドレス入力' });
});

router.get('/sendMail', function(req, res, next) {
    res.render('forgotPassword/sendMail', { title: 'メールの送信をしました' });
});

module.exports = router;