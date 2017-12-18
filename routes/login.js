'use strict';

const express = require('express');
const router = express.Router();

const hasher = require('../utils/hasher');

const schoolM = require('../models/school');
const partyM = require('../models/party');


/* GET home page. */
//TODO:
router.get('/', function(req, res, next) {
    res.render('login', { title: 'ログイン' });
});

//Login POST
router.post('/', (req, res, next) =>{
    const userId = req.body.userId;
    const password = req.body.password;

    if (req.session.schoolId){

    }else if(userId && password) {
        schoolM.findById(userId).then(model => {
            //ソルトを使用したリクエスト内のパスワードのハッシュ化
            if (model && hasher(password, model.salt) === model.password) {
                //セッションの発行
                req.session.schoolId = userId;
                next(req, res, next);

            } else {

            }
        }).catch(err => {

        });
    }else {
        //ユーザIDとパスワードの両方が入力されていなかった場合
        alert("ユーザーID、パスワードを入力してください")
    }

});

module.exports = router;