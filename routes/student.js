var express = require('express');
var router = express.Router();
const sequelize = require('../models/sequelize-loader').database;
// 画像投稿用
const multer = require('multer');

const studentM = require('../models/student');
const partyM = require('../models/party');

//TODO:
// バイナリファイルをROMに保存する設定
const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        // 画像の保存場所
        cb(null, './public/image')
    },
    filename: (req, file, cb)=> {

        const filename = file.fieldname + '-' + Date.now();

        // mimetypeによって新ファイルの拡張子を設定
        switch(file.mimetype) {
            case "image/jpeg":
                return cb(null, `${filename}.jpg`);
            case "image/png":
                return cb(null, `${filename}.jpg`);
            case "image/gif":
                return cb(null, `${filename}.gif`);
            default:
                return cb(null, filename)
        }
    }
});

// diskStrage設定を読み込む
const upload = multer({
    storage: storage,
});

router.get('/add', function(req, res, next) {
    res.render('contents/student/add', { title: '園児追加' });
});
router.post('/edit', function(req, res, next) {
    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        },
        required:true
    }).then(parties => {

        studentM.findAll({
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
    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        },
        required:true
    }).then(parties => {

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
router.post('/list', function(req, res, next) {
    const Op = sequelize.Op;
    var input = [];
    input[0] = req.body.name;
    input[1] = req.body.gender;
    input[2] = req.body.partyName;
    input[3] = req.body.age;

    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        },
        required:true
    }).then(parties => {
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
router.post('/list_post', function(req, res, next) {
    switch (req.body.order){
        case "del":
            var id = req.body.studentId.split(",");
            studentM.destroy({
                where: {
                    studentId: [id]
                }
            }).then(result => {
                return res.redirect('/contents/student/list');
            });
            break;
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
                    picturePath: req.body.picturePath
                },
                    {where: {
                        studentId: req.body.id
                    }
                }).then(result => {
                    return res.redirect('/contents/student/list');
                });
            });
            break;
    }

});

module.exports = router;
