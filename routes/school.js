var express = require('express');
var router = express.Router();

const schoolM = require('../models/school');
//TODO:

router.get('/add', function(req, res, next) {
    res.render('contents/school/add', { title: '保育園追加' });
});
router.get('/edit', function(req, res, next) {
    // 園のデータを取得
    schoolM.findOne({
        raw:true,
        where:{
            schoolId : "takahashi"
        }
    }).then(models => {
        res.render('contents/school/edit', { title: '保育園編集' , 'data': models});
    });
});
router.get('/end', function(req, res, next) {
    res.render('contents/school/end', { title: '本登録完了' });
});
router.get('/Provisional', function(req, res, next) {
    res.render('contents/school/Provisional', { title: '仮登録完了' });
});

module.exports = router;