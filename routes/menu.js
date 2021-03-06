const express = require('express');
const router = express.Router();

//GETメソッドはrouter.get
router.get('/', function(req, res, next) {
    //第一引数はpugのファイル名
    res.render('menu', { title: 'メニュー' ,schoolName:req.session.name});
});
//POSTメソッドはrouter.post
router.post('/', function(req, res, next) {
    //第一引数はpugのファイル名
    res.render('menu', { title: 'メニュー' });
});

module.exports = router;
