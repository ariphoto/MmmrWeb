/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const sequelize = require('../models/sequelize-loader').database;

const studentM = require('../models/student');
const partyM = require('../models/party');

// 画像投稿用
const multer = require('multer');
const uuidv4 = require('uuid/v4');

// バイナリファイルをROMに保存する設定
const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        // 画像の保存場所
        cb(null, './public/image');
    },
    filename: (req, file, cb)=> {
        return cb(null, `${req.body.id}.jpg`);
    }
});

// diskStorage設定を読み込む
const upload = multer({
    storage: storage,
});

// 園児追加ページヘの遷移
router.get('/add', function(req, res, next) {
    // 組 ドロップダウンのためにデータ取得
    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        },
        required:true
    }).then(parties => {
        res.render('contents/student/add', {title: '園児追加', 'parties': parties, newId: uuidv4()});
    });
});

// 園児編集ページヘの遷移
router.post('/edit', function(req, res, next) {
    // 組 ドロップダウンのためにデータ取得
    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        },
        required:true
    }).then(parties => {
        // 選択された園児のデータを取得
        studentM.findOne({
            raw:true,
            include:[
                {
                    model:partyM,
                    where:{
                        schoolId : "takahashi"
                    },
                    attributes: ["name"],
                    required:true
                }
            ],
            where:{
                studentId : req.body.studentId
            }
        }).then(models => {
            res.render('contents/student/edit', { title: '園児編集' , 'data': models, 'parties': parties});
        });
    });
});

// リストページ初回表示
router.get('/list', function(req, res, next) {
    // 組 ドロップダウンのためにデータ取得
    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        },
        required:true
    }).then(parties => {
        // 全データ取得
        studentM.findAll({
            raw:true,
            attributes: { include: [[sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('birthDay'), sequelize.fn('CURDATE')), 'age']] },
            include:[
                {
                    model:partyM,
                    where:{
                        schoolId : "takahashi"
                    },
                    attributes: ["name"],
                    required:true
                }
            ]
        }).then(models => {
            res.render('contents/student/list', { title: '園児一覧' , 'data': models, 'parties': parties});
        });
    });
});

// 絞り込みが行われた場合
router.post('/list', function(req, res, next) {
    const Op = sequelize.Op;
    const input = [req.body.name,req.body.gender,req.body.partyName,req.body.age];

    // 選択された組に対するpartyIdを取得
    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        },
        required:true
    }).then(parties => {
        // studentテーブルから抽出する
        studentM.findAll({
            raw: true,
            attributes: {include: [[sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('birthDay'), sequelize.fn('CURDATE')), 'age']]},
            include: [
                {
                    model: partyM,
                    where: {
                        schoolId: "takahashi",
                        name: {
                            [Op.like]: `%${input[2]}%`
                        }
                    },
                    attributes: ["name"],
                    required: true
                }
            ],
            where: {
                [Op.or]: {
                    name: {
                        [Op.like]: `%${input[0]}%`
                    },
                    phonetic: {
                        [Op.like]: `%${input[0]}%`
                    }
                },
                gender: {
                    [Op.like]: `${input[1]}%`
                },
            },
            having: {
                age: {
                    [Op.like]: `${input[3]}%`
                }
            }
        }).then(models => {
            res.render('contents/student/list', {title: '園児一覧', 'data': models, 'inputData': input, 'parties': parties});
        });
    });
});

// studentテーブルに対する追加・更新・削除
router.post('/list_post', function(req, res, next) {
    switch (req.body.order){
        // 削除
        case "del":
            const id = req.body.studentId.split(",");
            studentM.destroy({
                where: {
                    studentId: [id]
                }
            }).then(result => {
                return res.redirect('/contents/student/list');
            });
            break;
        // 更新
        case "upd":
            partyM.findAll({
                raw:true,
                where:{
                    name : req.body.party
                },
                required:true
            }).then(parties => {
                studentM.update({
                    name: req.body.name,
                    phonetic: req.body.phonetic,
                    nickname: req.body.nickname,
                    birthDay: req.body.birthDay,
                    gender: req.body.gender,
                    partyId: parties[0].partyId,
                    picturePath: req.body.picturePath,
                    remarks: req.body.remarks
                }, {
                    where: {
                        studentId: req.body.id
                    }
                }).then(result => {

                    return res.redirect('/contents/student/list');
                });
            });
            break;
        // 追加
        default:
            partyM.findAll({
                raw:true,
                where:{
                    name : req.body.party
                },
                required:true
            }).then(parties => {
                studentM.upsert({
                    studentId: req.body.id,
                    name: req.body.name,
                    phonetic: req.body.phonetic,
                    nickname: req.body.nickname,
                    birthDay: req.body.birthDay,
                    gender: req.body.gender,
                    partyId: parties[0].partyId,
                    picturePath: req.body.picturePath,
                    remarks: req.body.remarks
                }).then(result => {
                    return res.redirect('/contents/student/list');
                });
            });
    }
});

// 画像投稿
router.post('/picture', upload.single('image') ,(req, res, next)=>{
    res.end();
});

module.exports = router;
