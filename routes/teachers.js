var express = require('express');
var router = express.Router();
const sequelize = require('../models/sequelize-loader').database;

const uuidv4 = require('uuid/v4');
const teachersM = require('../models/teacher');

//TODO:


router.get('/edit', function(req, res, next) {
    res.render('contents/teachers/edit', { title: '保育士編集' });
});
router.get('/list', function(req, res, next) {

    teachersM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        }
    }).then(models => {
        res.render('contents/teachers/list', { title: '保育士一覧' , 'data': models});
    });
});
router.post('/list', function(req, res, next) {
    const Op = sequelize.Op;
    var input = req.body.name;
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
    });
});
router.post('/list_post', function(req, res, next) {
    switch (req.body.order) {
        case "del":
            var id = req.body.teacherId.split(",");
            console.log(req.body.teacherId);
            teachersM.destroy({
                where: {
                    teacherId: [id]
                }
            }).then(result => {
                return res.redirect('/contents/teachers/list');
            });
            break;
        case "upd":
            teachersM.update({
                    name: req.body.name,
                    remarks: req.body.remarks
                },
                {
                    where: {
                        teacherId: req.body.teacherId
                    }
                }).then(result => {
                return res.redirect('/contents/teachers/list');
            });
            break;
        default:
            teachersM.upsert({
                teacherId: uuidv4(),
                name: req.body.name,
                remarks: req.body.remarks,
                schoolId: "takahashi"
            }).then(result => {
                return res.redirect('/contents/teachers/list');
            });
    }
});

module.exports = router;