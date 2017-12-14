const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const schoolM = require('../models/school');
const hasher =require('../utils/hasher');
const salt = 'shio';
const uuidv4 = require('uuid/v4');


router.get('/add', function(req, res, next) {
    res.render('contents/school/add', { title: '保育園追加' });
});
router.get('/edit', function(req, res, next) {
    res.render('contents/school/edit', { title: '保育園編集' });
});
router.get('/end', function(req, res, next) {
    res.render('contents/school/end', { title: '本登録完了' });
});

router.get('/Provisional', function(req, res, next) {

});
router.post('/Provisional', function(req, res, next){

    //データベースに仮登録
    schoolM.upsert({

        schoolId:req.body.School_Id,
        mailAddress:req.body.address,
        name:req.body.name,
        password:hasher(req.body.Password,salt),
        salt:salt,
        provisional_flg:false,
        hidden_key:uuidv4()

    }).then(result =>{
        res.render('contents/school/Provisional', { title: '仮登録完了' , destination: req.body.address});
        //成功したらメール送信
        const transporter = nodemailer.createTransport( smtpTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // SSL
            auth: {
                user: 'oic.mmmrkn@gmail.com',
                pass: 'mimamorikun'
            }
        }));

        const mailOptions = {
            from    : 'みまもるくん公式 <oic.mmmrkn@gmail.com>', // 送信元アドレス
            to      : req.body.address ,// 送信するアドレス
            subject : 'ご登録ありがとうございます。', // タイトル
            text    : req.body.name + '様'

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