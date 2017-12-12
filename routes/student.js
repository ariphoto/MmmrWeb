var express = require('express');
var router = express.Router();
const sequelize = require('../models/sequelize-loader').database;

const studentM = require('../models/student');
const partyM = require('../models/party');

//TODO:


router.get('/add', function(req, res, next) {
    res.render('contents/student/add', { title: '園児追加' });
});
router.get('/edit', function(req, res, next) {
    res.render('contents/student/edit', { title: '園児編集' });
});

// リストページ初回表示
router.get('/list', function(req, res, next) {
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
        res.render('contents/student/list', { title: '園児一覧' , 'data': models});
    });
});
router.post('/list', function(req, res, next) {
    const Op = sequelize.Op;
    var input = [];
    input[0] = req.body.name;
    input[1] = req.body.gender;
    input[2] = req.body.partyName;
    input[3] = req.body.age;

    studentM.findAll({
        raw: true,
        attributes: { include: [[sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('birthDay'), sequelize.fn('CURDATE')), 'age']] },
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
            phonetic: {
                [Op.like]: `%${input[0]}%`
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
        res.render('contents/student/list', {title: '園児一覧', 'data': models, 'inputData' : input});
    });
});
router.post('/list_post', function(req, res, next) {
    var id = req.body.studentId.split(",");
    console.log(req.body.studentId);
    studentM.destroy({
        where: {
            studentId: [id]
        }
    }).then(result => {
        return res.redirect('/contents/student/list');
    });
});
module.exports = router;
