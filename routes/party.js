const express = require('express');
const router = express.Router();
const sequelize = require('../models/sequelize-loader').database;

const uuidv4 = require('uuid/v4');
const partyM = require('../models/party');

//TODO:
router.get('/edit', function(req, res, next) {
    res.render('contents/party/edit', { title: 'クラス編集' });
});
router.get('/list', function(req, res, next) {
    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi"
        }
    }).then(models => {
        res.render('contents/party/list', { title: 'クラス一覧' , 'data': models});
    });
});
router.post('/list', function(req, res, next) {
    const Op = sequelize.Op;
    let input = req.body.name;
    partyM.findAll({
        raw:true,
        where:{
            schoolId : "takahashi",
            name: {
                [Op.like]: `%${input}%`
            }
        }
    }).then(models => {
        res.render('contents/party/list', { title: 'クラス一覧' , 'data': models, 'inputData': input});
    });
});
router.post('/list_post', function(req, res, next) {
    switch (req.body.order){
        case "del":
            let id = req.body.partyId.split(",");
            console.log(req.body.partyId);
            partyM.destroy({
                where: {
                        partyId: [id]
                    }
            }).then(result => {
                return res.redirect('/contents/party/list');
            });
            break;
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
        default:
            partyM.upsert({
                partyId : uuidv4(),
                name: req.body.name,
                remarks: req.body.remarks,
                schoolId: "takahashi"
            }).then(result => {
                return res.redirect('/contents/party/list');
            });
    }
});

module.exports = router;