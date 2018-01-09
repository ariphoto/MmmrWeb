'use strict';

const express = require('express');
const router = express.Router();
const schoolM = require('../models/school');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const gmailAuth =require('../auth/gmail');

/**
 * GET home page.
 */
//TODO:editへのパスを設定する

router.get('/edit', function(req, res, next) {
    //getでhidden_keyが送られているかどうか
    if(req.query.hidden_key){
        console.log(req.query.hidden_key);
        console.log('キー送信成功');
        const hidden = req.query.hidden_key;
        schoolM.findOne({
            where: {
            hidden_key: [hidden]
        }}).then(model =>{
            //送られたhidden_keyがデータベースに存在するかどうか
            if(model&&hidden===model.hidden_key){
                res.render('forgotPassword/edit', { title: 'パスワード変更画面' });
            }else{
                console.log('キーがありません');
                res.render('/', { title: 'キーが存在しない' });
            }
        })
    }else{
        console.log('キー送信失敗');
        res.render('/', { title: 'キーがゲットされていない' });
    }
});

router.get('/inputAddress', function(req, res, next) {
    res.render('forgotPassword/inputAddress', { title: 'メールアドレス入力' });
});

router.get('/sendMail', function(req, res, next) {
    res.render('forgotPassword/sendMail', { title: 'メールの送信をしました' });
});

//パスワード確認(登録されたメールアドレスとユーザーID)をPOST
router.post("/inputAddress", (req, res, next)=>{
    console.error(req.body);
    const userID = req.body.userID;
    const userURL = req.body.userURL;


    if(userID && userURL){
        schoolM.findById(userID).then(model =>{
            if(model && model.mailAddress===userURL){
                console.error(model.mailAddress);
                //成功したらメール送信
                //送信側の設定
                const hidden = model.hidden_key;
                const transporter = nodemailer.createTransport( smtpTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // SSL
                    auth: gmailAuth
                }));

                //送信されるメール
                const mailOptions = {
                    from    : 'みまもるくん公式 <oic.mmmrkn@gmail.com>', // 送信元アドレス
                    // to      : model.mailAddress ,// 送信するアドレス
                    to      :'oic.s.tomosue@gmail.com'  ,// 送信テストアドレス
                    subject : 'パスワード変更のURLを送信しました', // タイトル
                    text    : model.name + '様。\n' +
                    '次のURLにアクセスしてください\n' +
                    ` http://localhost:3000/forgotPassword/edit?hidden_key=${hidden}\n`
                };

                transporter.sendMail( mailOptions, function( error, info ){
                    if( error ){
                        return console.log( error );
                    }
                    console.log('Message sent: ');
                });

                //送信が成功したら次の画面resする
                res.render('forgotPassword/inputAddress',{message:"メールが送信されました"});

            } else {
                const  err = 'data is wrong';
                console.log('データが見つかりません');
                res.render('forgotPassword/inputAddress',{message: "データが見つかりません"});
            }
        })
    }else {
        //ユーザIDと登録URLのどちらか一つでも入力されていなかった場合
        res.render('forgotPassword/inputAddress',{message: "IDとURLを入力してください"})
    }

});
module.exports = router;