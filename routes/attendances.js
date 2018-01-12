const express = require('express');
const router = express.Router();
const sequelize = require('../models/sequelize-loader').database;
const uuidv4 = require('uuid/v4');
const studentM = require('../models/student');
const partyM = require('../models/party');
const attendancesM = require('../models/attendance');
const connectionError = 'connection error.'; //接続エラーメッセージ
const date = new Date();
const thisYear = date.getFullYear(); // 今年の西暦
let startYear = thisYear - 6; // 絞り込み開始年 (今年の6年前)
const Op = sequelize.Op;

const dateUtil = require('../utils/dateEditor');

//TODO:
// リストページ初回表示
// router.get('/output_logs', function (req, res, next) {
//     partyM.findAll({
//         raw: true,
//         where: {
//             schoolId: req.session.schoolId
//         }
//     }).then(parties => {
//         // 全データ取得
//         studentM.findAll({
//             raw: true,
//             attributes: {include: [[sequelize.fn('timestampdiff', sequelize.literal('year'), sequelize.col('birthDay'), sequelize.fn('CURDATE')), 'age']]},
//             where: {
//                 birthDay: {
//                     [Op.between]: [thisYear - 6 + '-01-01', thisYear + '-03-31']
//                 }
//             },
//             include: [
//                 {
//                     model: partyM,
//                     where: {
//                         schoolId: req.session.schoolId
//                     },
//                     attributes: ["name"],
//                     required: true
//                 }
//             ]
//         }).then(models => {
//             res.render('contents/attendances/output_logs', {
//                 title: '出席ログ',
//                 schoolName: req.session.name,
//                 'data': models,
//                 'parties': parties
//             });
//         }).catch(function (err) {
//             if (err)
//                 console.error(err);
//             res.status(500).send(connectionError);
//         });
//     }).catch(function (err) {
//         if (err)
//             res.status(500).send(connectionError);
//     });
// });

// 絞り込みが行われた場合
router.get('/output_logs', function (req, res, next) {
    const Op = sequelize.Op;
    // const input = req.query.name;
    const studentName = req.query.studentName;
    const toDate = req.query.toDate;
    const fromDate = req.query.fromDate;
    const partyName = req.query.party;

    const attendanceQuery = {

        where:{},
        //TODO: ここにBETWEEN
        include: [
            {
                where:{},
                model: studentM,
                attributes: ["name"],
                //TODO: ここにLIKE
                required: true,
                include: [{
                    where:{},
                    model: partyM,
                    attributes: ["name"],
                    //TODO: ここにLIKE
                    required: true
                }]
            }
        ]
    };

    if (studentName) {
        attendanceQuery.include[0].where.name ={
            [Op.like]: `%${studentName}%`
        }
    }

    if (partyName) {
        attendanceQuery.include[0].include[0].where.name = {
            [Op.like]: `${partyName}`
        }
    }

    if (toDate && fromDate) {
        attendanceQuery.where.time = {
            [Op.between]: [new Date(fromDate), new Date(toDate)]
        }
    } else if (toDate) {
        attendanceQuery.where.time = {
            [Op.between]: [dateUtil.getStart(toDate), dateUtil.getEnd(toDate)]
        }
    } else if (fromDate) {
        attendanceQuery.where.time = {
            [Op.between]: [dateUtil.getStart(fromDate), dateUtil.getEnd(fromDate)]
        }
    }


    // 選択された組に対するpartyIdを取得
    Promise.all([
        partyM.findAll({
            where: {
                schoolId: req.session.schoolId
            }
        }),
        attendancesM.findAll(attendanceQuery)
    ]).then(models => {
        console.log(JSON.stringify(models[1]));
        res.render('contents/student/list', {
            title: '園児一覧',
            schoolName: req.session.name,
            'inputData': input,
            'parties': models[0]
        });
    }).catch(function (err) {
        if (err)
            res.status(500).send(connectionError);
    });

});

module.exports = router;