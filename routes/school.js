const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const schoolM = require('../models/school');
const hasher =require('../utils/hasher');
const salt = 'shio';
const uuidv4 = require('uuid/v4');
const gmailAuth =require('../auth/gmail');


router.get('/add', function(req, res, next) {
    res.render('contents/school/add', { title: '保育園追加' });
});
router.get('/edit', function(req, res, next) {
    res.render('contents/school/edit', { title: '保育園編集' });
});

//本登録

router.get('/end', function(req, res, next) {
    //DB更新
    //todo 結果が一件もなかったときのcatchを書く　trueで本登録完了画面　falseでエラー画面
   schoolM.update({
       provisional_flg:true
   },
       {
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