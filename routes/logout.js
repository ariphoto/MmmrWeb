'use strict';
const express = require('express');
const router = express.Router();

//TODO:
router.get('/',function (req, res, next){
    //
    req.session.schoolId=null;
    res.render('logout',{title: 'ログアウト画面'});
});

module.exports = router;
