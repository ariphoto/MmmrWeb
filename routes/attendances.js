const express = require('express');
const router = express.Router();
const sequelize = require('../models/sequelize-loader').database;
const uuidv4 = require('uuid/v4');
const partyM = require('../models/party');
const connectionError = 'connection error.'; //接続エラーメッセージ

//TODO:
// リストページ初回表示
router.get('/output_logs',function(req, res, next){
    partyM.findAll({
        raw:true,
        where:{
            schoolId : req.session.schoolId
        }
    }).then(models => {
        res.render('contents/attendances/output_logs',{title:'出席ログ' , schoolName:req.session.name, 'data': models});
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

module.exports = router;