"use strict";
const express = require('express');
const router = express.Router();

const hasher = require('../utils/hasher');
const salt = 'shio';
const schoolM = require('../models/school');

const connectionError = 'connection error.'; //接続エラーメッセージ
//TODO:

router.get('/add', function(req, res, next) {
    res.render('contents/school/add', { title: '保育園追加' });
});

// 保育園編集ページヘの遷移
router.get('/edit', function(req, res, next) {
    // 園のデータを取得
    schoolM.findOne({
        raw:true,
        where:{
            schoolId : "guriko"
        }
    }).then(models => {
        res.render('contents/school/edit', { title: '保育園編集' , 'data': models});
    }).catch(function(err) {
        if(err) {
            res.status(500).send(connectionError);
        }
    });
});

// 保育園情報更新
router.post('/edit', function(req, res, next) {
    // チェックがOKで、新規パスワードが入力されている場合
    if (req.body.pass !== '') {
        schoolM.findById(req.body.id).then(model => {
            //ソルトを使用したリクエスト内のパスワードのハッシュ化 現在のパスワードが一致した場合
            if (model && hasher(req.body.oldPass, model.salt) === model.password) {
                // 新規パスワード2つが一致している場合
                if (req.body.pass === req.body.passConf) {
                    console.log("一致");
                    schoolM.update({
                        schoolId: req.body.newId,
                        name: req.body.name,
                        phonetic: req.body.phonetic,
                        mailAddress: req.body.mailAddress,
                        password: hasher(req.body.pass, model.salt)
                    }, {
                        where: {
                            schoolId: req.body.id
                        }
                    }).then(result => {
                        res.end('更新しました');
                    }).catch(function (err) {
                        if (err) {
                            if (err.parent.errno === 1062) {
                                res.end('このIDは使用できません');
                            } else {
                                res.status(500).send(connectionError);
                            }
                        }
                    });
                } else {
                    console.log("不一致");
                    res.end('新規パスワードが一致しません');
                }
            } else {
                console.log("現在パス");
                res.end('パスワードが違います');
            }
        });
    } else {
        // パスワード以外の更新
        schoolM.update({
            schoolId: req.body.newId,
            name: req.body.name,
            phonetic: req.body.phonetic,
            mailAddress: req.body.mailAddress,
        }, {
            where: {
                schoolId: req.body.id
            }
        }).then(result => {
            res.end('更新しました');
        }).catch(function (err) {
            if (err) {
                if (err.parent.errno === 1062) {
                    res.end('このIDは使用できません');
                } else {
                    res.status(500).send(connectionError);
                }
            }
        });
    }
});
router.get('/end', function(req, res, next) {
    res.render('contents/school/end', { title: '本登録完了' });
});
router.get('/Provisional', function(req, res, next) {
    res.render('contents/school/Provisional', { title: '仮登録完了' });
});

module.exports = router;