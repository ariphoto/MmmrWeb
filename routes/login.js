'use strict';

const express = require('express');
const router = express.Router();

const hasher = require('../utils/hasher');

const schoolM = require('../models/school');
const partyM = require('../models/party');


/* GET home page. */
//TODO:
router.get('/', function(req, res, next) {
    //セッションの破棄
    req.session.schoolId = null;
    res.render('login', { title: 'ログイン画面' });
});

//Login POST
router.post('/', (req, res, next) =>{
    console.log(req.body);
    req.session.schoolId = null;
    const userId = req.body.schoolId;
    const password = req.body.password;

    if(userId && password) {
        schoolM.findById(userId).then(model => {
            //ソルトを使用したリクエスト内のパスワードのハッシュ化
            if (model && hasher(password, model.salt) === model.password) {
                console.log(req.session.schoolId);
                //セッションの発行
                req.session.schoolId = req.body.schoolId;

                //next(req, res, next);
                res.redirect('../');
            } else {
                const  err = 'data is wrong';
                console.log('パスワードが違います');
                res.render('login',{message: "パスワードが違います"});
            }
        }).catch(err => {
            res.render("server_error")
        });
    }else {
        //ユーザIDとパスワードの両方が入力されていなかった場合
        //res.redirect('/login');
        res.render('login',{message: "IDとパスワードを入力してください"})
    }
});

module.exports = router;