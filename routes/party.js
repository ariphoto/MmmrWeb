const express = require('express');
const router = express.Router();
const sequelize = require('../models/sequelize-loader').database;
const uuidv4 = require('uuid/v4');
const partyM = require('../models/party');
const connectionError = 'connection error.'; //接続エラーメッセージ

//TODO:
router.get('/edit', function(req, res, next) {
    res.render('contents/party/edit', { title: 'クラス編集' });
});

// リストページ初回表示
router.get('/list', function(req, res, next) {
    partyM.findAll({
        raw:true,
        where:{
            schoolId : req.session.schoolId
        }
    }).then(models => {
        res.render('contents/party/list', { title: 'クラス一覧' , schoolName:req.session.name, 'data': models});
    }).catch(function(err) {
        if(err)
            res.status(500).send(connectionError);
    });
});

// 絞り込みが行われた場合
router.post('/list', function(req, res, next) {
    const Op = sequelize.Op;
    const input = req.body.name;
    partyM.findAll({
        raw:true,
        where:{
            schoolId : req.session.schoolId,
            name: {
                [Op.like]: `%${input}%`
            }
        }
    }).then(models => {
        res.render('contents/party/list', { title: 'クラス一覧' , schoolName:req.session.name, 'data': models, 'inputData': input});
    }).catch(function(err) {
        if(err)
            res.status(500).send(connectionError);
    });
});

// partiesテーブルに対する追加・更新・削除
router.post('/list_post', function(req, res, next) {
    switch (req.body.order){
        // 削除
        case "del":
            const id = req.body.partyId.split(",");
            console.log(req.body.partyId);
            partyM.destroy({
                where: {
                        partyId: [id]
                    }
            }).then(result => {
                return res.redirect('/contents/party/list');
            });
            break;
        // 更新
        case "upd":
            partyM.update({
                    name: req.body.name,
                    remarks: req.body.remarks
                },
                {where: {
                    partyId: req.body.partyId
                }
                }).then(result => {
                return res.redirect('/contents/party/list');
            });
            break;
        // 削除
        default:
            partyM.upsert({
                partyId : uuidv4(),
                name: req.body.name,
                remarks: req.body.remarks,
                schoolId: req.session.schoolId
            }).then(result => {
                return res.redirect('/contents/party/list');
            }).catch(function(err) {
                if(err)
                    res.status(500).send(connectionError);
            });
    }
});

//attendancesLogの出力ページ
router.post('/attendanceslog',function(req, res, next){
    res.render('contents/party/attendanceslog', { title: '出席ログ出力'})
});

module.exports = router;