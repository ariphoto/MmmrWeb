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

const connectionError = 'connection error.'; //接続エラーメッセージ
//TODO:

router.get('/add', function(req, res, next) {
    res.render('contents/school/add', { title: '保育園追加' });
});
router.get('/edit', function(req, res, next) {
    // 園のデータを取得
    schoolM.findOne({
        raw:true,
        where:{
            schoolId : req.session.schoolId
        }
    }).then(models => {
        res.render('contents/school/edit', { title: '保育園編集' , schoolName:req.session.name, 'data': models});
    }).catch(function(err) {
        if(err) {
            res.status(500).send(connectionError);
        }
    });
});

// 保育園情報更新
router.post('/edit', function(req, res, next) {
    // チェックがOKで、新規パスワードが入力されている場合
    if (req.body.password !== '') {
        schoolM.findById(req.body.id).then(model => {
            //ソルトを使用したリクエスト内のパスワードのハッシュ化 現在のパスワードが一致した場合
            if (model && hasher(req.body.oldPass, model.salt) === model.password) {
                // 新規パスワード2つが一致している場合
                if (req.body.password === req.body.passwordRe) {
                    console.log("一致");
                    schoolM.update({
                        schoolId: req.body.schoolId,
                        name: req.body.name,
                        phonetic: req.body.phonetic,
                        mailAddress: req.body.address,
                        password: hasher(req.body.password, model.salt)
                    }, {
                        where: {
                            schoolId: req.body.id
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
            schoolId: req.body.schoolId,
            name: req.body.name,
            phonetic: req.body.phonetic,
            mailAddress: req.body.address,
        }, {
            where: {
                schoolId: req.body.id
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
    //todo 結果が一件もなかったときのcatchを書く　trueで本登録完了画面　falseでエラー画面
   schoolM.update({
       provisional_flg:true
   }, {
       where:{
           provisional_flg:false,
           hidden_key:req.query.hidden_key
       }
   }).then(function (value) {
       res.render('contents/school/end', {title: '本登録完了'});
   }).catch(function (error) {
        res.render('contents/school/error', {title:'本登録失敗'});
   });
});


router.post('/provisional', function(req, res, next){

    //hiddenkeyの発行
    let hidden = uuidv4();


    //データベースに仮登録
    schoolM.upsert({
        schoolId:req.body.schoolId,
        mailAddress:req.body.address,
        name:req.body.name,
        password:hasher(req.body.password,salt),
        salt:salt,
        provisional_flg:false,
        hidden_key:hidden
    }).then(result =>{
        res.render('contents/school/Provisional', { title: '仮登録完了' , destination: req.body.address});
        //成功したらメール送信
        const transporter = nodemailer.createTransport( smtpTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // SSL
            auth: gmailAuth //有満ローカル内にログイン情報あり
        }));

        //todo urlを動的に
        const mailOptions = {
            from    : 'みまもるくん公式 <oic.mmmrkn@gmail.com>', // 送信元アドレス
            to      : req.body.address ,// 送信するアドレス
            subject : 'ご登録ありがとうございます。', // タイトル
            text    :
                ` ${req.body.name}様　ご登録ありがとうございます。
                  下記のURLにアクセスしていただくことで本登録が完了します。
                  http://localhost:3000/contents/school/end?hidden_key=${hidden}`

        };

        transporter.sendMail( mailOptions, function( error, info ){
            if( error ){
                return console.log( error );
            }
            console.log('Message sent: ');

        });
    });


});

module.exports = router;