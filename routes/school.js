"use strict";
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const schoolM = require('../models/school');
const hasher =require('../utils/hasher');
const salt = 'shio';
const uuidv4 = require('uuid/v4');
const gmailAuth =require('../auth/gmail');
const sequelize = require('../models/sequelize-loader').database;

const connectionError = 'connection error.'; //接続エラーメッセージ
const reg = /^[a-z\d]{8,20}$/i; // ID・パスワードのパターン
//TODO:

router.get('/add', function(req, res, next) {
    res.render('contents/school/add', { title: '保育園追加' });
});
router.get('/edit', function(req, res, next) {
    // セッションがない場合はログインへ
    if (!req.session.schoolId) {
        res.redirect('/login');
        return;
    }
    // 園のデータを取得
    schoolM.findOne({
        raw:true,
        where:{
            schoolId : req.session.schoolId
        }
    }).then(models => {
        res.render('contents/school/edit', { title: '設定' , schoolName:req.session.name, 'data': models});
    }).catch(function(err) {
        if(err) {
            res.status(500).send(connectionError);
        }
    });
});

// 保育園情報更新
router.post('/edit', function(req, res, next) {
    // 入力したIDが不正な場合
    if(!req.body.schoolId.match(reg)){
        res.end('このIDは使用できません');
        return;
    }
    // 新規パスワードが入力されている場合
    if (req.body.password !== '') {
        schoolM.findById(req.session.schoolId).then(model => {
            //ソルトを使用したリクエスト内のパスワードのハッシュ化 現在のパスワードが一致した場合
            if (model && hasher(req.body.oldPass, model.salt) === model.password) {
                // 新規パスワード2つが一致している場合
                if (req.body.password === req.body.passwordRe && req.body.password.match(reg)) {
                    console.log("一致");
                    schoolM.update({
                        schoolId: req.body.schoolId,
                        name: req.body.name,
                        phonetic: req.body.phonetic,
                        mailAddress: req.body.address,
                        password: hasher(req.body.password, model.salt)
                    }, {
                        where: {
                            schoolId: req.session.schoolId
                        }
                    }).then(result => {
                        // セッション情報の上書き
                        req.session.schoolId = req.body.schoolId;
                        req.session.name = req.body.name;

                        res.end('更新しました');
                    }).catch(function (err) {
                        if (err) {
                            console.log(err);
                            if (err.parent !== undefined && err.parent.errno === 1062) {
                                res.end('このIDは使用できません');
                            } else {
                                res.end("エラー");
                            }
                        }
                    });
                } else {
                    console.log("不一致");
                    res.end('新規パスワードが正しくありません');
                }
            } else {
                console.log("現在パス");
                res.end('パスワードが違います');
            }
        });
    } else {
        // パスワード以外の更新
        schoolM.update({
            schoolId: req.body.schoolId,
            name: req.body.name,
            phonetic: req.body.phonetic,
            mailAddress: req.body.address,
        }, {
            where: {
                schoolId: req.session.schoolId
            }
        }).then(result => {
            // セッション情報の上書き
            req.session.schoolId = req.body.schoolId;
            req.session.name = req.body.name;

            res.end('更新しました');
        }).catch(function (err) {
            if (err) {
                if (err.parent !== undefined && err.parent.errno === 1062) {
                    res.end('このIDは使用できません');
                } else {
                    res.end('エラー');
                }
            }
        });
    }
});

//本登録

router.get('/end', function(req, res, next) {
    //DB更新
    //パラメーターに入れられたhidden_keyを参照に該当データがあるか検証
    schoolM.find({
        where:{
            hidden_key : req.query.hidden_key
        }
        //見つかった場合該当データの仮登録フラグをfalseからtrueへ、登録完了画面を出す
    }).then(model => {
        model.update({
            provisional_flg: true
        });
        res.render('contents/school/end');
        //見つからなかった場合見つからなかったとページに表示する
    }).catch(function(){
        res.render('contents/school/error');
    });

});

router.post('/provisional', function(req, res, next){

    //hiddenkeyの発行
    let hidden = uuidv4();
    //重複するIDが入力された場合登録せずに再入力を促すページへ
    schoolM.findById(req.body.schoolId).then(model => {
        if(req.body.schoolId === model.schoolId){
            res.render('contents/school/suffer');
        }else{
        }
    }).catch(function() {

        //重複するIDがないならデータベースに仮登録
        schoolM.upsert({
            schoolId: req.body.schoolId,
            mailAddress: req.body.address,
            name: req.body.name,
            password: hasher(req.body.password, salt),
            salt: salt,
            provisional_flg: false,
            hidden_key: hidden
        }).then(result => {

            res.render('contents/school/Provisional', {title: '仮登録完了', destination: req.body.address});
            //成功したらメール送信
            const transporter = nodemailer.createTransport(smtpTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // SSL
                auth: gmailAuth //有満ローカル内にログイン情報あり
            }));

            //todo urlを動的に
            const mailOptions = {
                from: 'こどもスタンプ公式 <oic.mmmrkn@gmail.com>', // 送信元アドレス
                to: req.body.address,// 送信するアドレス
                subject: 'ご登録ありがとうございます。', // タイトル
                text:
                    ` ${req.body.name}様　ご登録ありがとうございます。
                  下記のURLにアクセスしていただくことで本登録が完了します。
                  http://localhost:3000/contents/school/end?hidden_key=${hidden}`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: ');
            });
        });
    });
});

module.exports = router;