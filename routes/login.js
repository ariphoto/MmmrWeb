'use strict';

const express = require('express');
const router = express.Router();

const hasher = require('../utils/hasher');

const schoolM = require('../models/school');
const partyM = require('../models/party');


/* GET home page. */
//TODO:
router.get('/', function(req, res, next) {
    res.render('./login/login', { title: 'ログイン画面' });
});

//Login POST
router.post('/', (req, res, next) =>{
    const userId = req.body.userId;
    const password = req.body.password;

    if(userId && password) {
        schoolM.findById(userId).then(model => {
            //ソルトを使用したリクエスト内のパスワードのハッシュ化
            if (model && hasher(password, model.salt) === model.password) {
                //セッションの発行
                req.session.schoolId = userId;
                //next(req, res, next);
                res.redirect('../');
            } else {
                const  err = 'data is wrong';
                res.render('login',{error:err});
            }
        }).catch(err => {
            res.render("server_error")
        });
    }else {
        //ユーザIDとパスワードの両方が入力されていなかった場合
        res.redirect('/login');
    }

});

module.exports = router;