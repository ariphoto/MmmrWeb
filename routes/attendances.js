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

// 絞り込みが行われた場合
router.get('/output_logs', function (req, res, next) {
    const Op = sequelize.Op;
    // const input = req.query.name;
    const studentName = req.query.student;
    const partyName = req.query.party;
    let year = req.query.year;
    if (!year) {
        year = new Date().getFullYear();
    }
    let month = req.query.month;
    if (!month) {
        month = new Date().getMonth() + 1;
    }
    let week = req.query.week;
    if (!week) {
        week = 1;
    }

    const inputData = {
        studentName: studentName,
        partyName: partyName,
        year: year,
        month: month,
        week: week
    };

    console.error(year);
    console.error(month);
    console.error(week);
    console.error(partyName);

    const attendanceQuery = {
        attributes: ["name"],
        where: {},
        include: [
            {
                attributes: [
                    "time",
                    [sequelize.fn('date_format', sequelize.col('time'), '%e'), 'formed']
                ],
                where: {},
                model: attendancesM,
                required: false,
            },
            {
                where: {},
                model: partyM,
                attributes: ["name"],
                required: true
            }

        ],
        order: [['name', 'ASC'],['attendances','time','ASC']],
        // group:[[sequelize.fn('date_format', sequelize.col('attendances.time'), '%e')]]

    };

    if (studentName) {
        attendanceQuery.where.name = {
            [Op.like]: `%${studentName}%`
        };
    }

    if (partyName) {
        attendanceQuery.include[1].where.name = {
            [Op.like]: `${partyName}`
        };
    }
    //始まりの日付
    let startDate;
    //終わりの日付
    let endDate;

    //TODO:時差を考慮する
    //月の始まりの日付
    const startMonthDate = new Date(year, month - 1, 1);
    //月の終わりの日付
    const endMonthDate = new Date(year, month, 0);
    //第2週の始まりの日付
    const secondWeekStartDate = new Date(startMonthDate);
    secondWeekStartDate.setDate(1 + (7 - secondWeekStartDate.getDay()));

    if (week === "1" || week === 1) {
        startDate = startMonthDate;
        endDate = secondWeekStartDate;
    } else {
        startDate = new Date(secondWeekStartDate);
        startDate.setDate(startDate.getDate() + (week - 2) * 7 + 1);
        const endWeekDate = new Date(startDate);
        endWeekDate.setDate(endWeekDate.getDate() + 6);
        if (endMonthDate.getTime() < endWeekDate.getTime()) {
            endDate = endMonthDate;
        } else {
            endDate = endWeekDate;
        }
    }
    if (startDate && endDate) {
        attendanceQuery.include[0].where.time = {
            [Op.between]: [startDate, dateUtil.getEnd(endDate)]
        };
    } else {
        console.log(startDate);
        console.log(endDate);
    }

    // 選択された組に対するpartyIdを取得
    Promise.all([
        partyM.findAll({
            where: {
                schoolId: req.session.schoolId
            }
        }),
        studentM.findAll(attendanceQuery)
    ]).then(models => {
        console.log(JSON.stringify({
            inputData: inputData,
            parties: models[0],
            results: models[1],
            startDate: startDate.getDate(),
            endDate: endDate.getDate()
        }));
        res.render('contents/attendances/output_logs', {
            title: '出席記録',
            schoolName: req.session.name,
            inputData: inputData,
            parties: models[0],
            results: models[1],
            startDate: startDate.getDate(),
            endDate: endDate.getDate()
        });
    }).catch(function (err) {
        console.error(err);
        res.status(500).send(connectionError);
    });

});

module.exports = router;