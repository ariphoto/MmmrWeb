const express = require('express');
const router = express.Router();
const sequelize = require('../models/sequelize-loader').database;

const uuidv4 = require('uuid/v4');
const teachersM = require('../models/teacher');

const connectionError = 'connection error.'; //接続エラーメッセージ

//TODO:


router.get('/edit', function(req, res, next) {
    res.render('contents/teachers/edit', { title: '保育士編集' });
});

// リストページ初回表示
router.get('/list', function(req, res, next) {
    teachersM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        }
    }).then(models => {
        res.render('contents/teachers/list', { title: '保育士一覧' , 'data': models});
    }).catch(function(err) {
        if(err)
            res.status(500).send(connectionError);
    });
});

// 絞り込みが行われた場合
router.post('/list', function(req, res, next) {
    const Op = sequelize.Op;
    const input = req.body.name;
    teachersM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi",
            name: {
                [Op.like]: `%${input}%`
            }
        }
    }).then(models => {
        res.render('contents/teachers/list', {title: '保育士一覧', 'data': models, 'inputData': input});
    }).catch(function(err) {
        if(err)
            res.status(500).send(connectionError);
    });
});

// teachersテーブルに対する追加・更新・削除
router.post('/list_post', function(req, res, next) {
    switch (req.body.order) {
        // 削除
        case "del":
            const id = req.body.teacherId.split(",");
            console.log(req.body.teacherId);
            teachersM.destroy({
                where: {
                    teacherId: [id]
                }
            }).then(result => {
                return res.redirect('/contents/teachers/list');
            }).catch(function(err) {
                if(err)
                    res.status(500).send(connectionError);
            });
            break;
        // 更新
        case "upd":
            teachersM.update({
                    name: req.body.name,
                    remarks: req.body.remarks
                }, {
                    where: {
                        teacherId: req.body.teacherId
                    }
                }).then(result => {
                return res.redirect('/contents/teachers/list');
            }).catch(function(err) {
                if(err)
                    res.status(500).send(connectionError);
            });
            break;
        // 追加
        default:
            teachersM.upsert({
                teacherId: uuidv4(),
                name: req.body.name,
                remarks: req.body.remarks,
                schoolId: "takahashi"
            }).then(result => {
                return res.redirect('/contents/teachers/list');
            }).catch(function(err) {
                if(err)
                    res.status(500).send(connectionError);
            });
    }
});

module.exports = router;