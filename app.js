"use strict";

const sequelize = require('./models/sequelize-loader').database;
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // MySQLを使用
const helmet = require('helmet'); // helmet(セキュリティ対策)

// マスタのモデルの読み込み
const schoolM = require('./models/school');
const teacherM = require('./models/teacher');
const partyM = require('./models/party');
const studentM = require('./models/student');
// トランザクションのモデルの読み込み
const attendance = require('./models/attendance');
const goHome = require('./models/goHome');
const creates = require('./creates/creates');
//sessionの設定
const session = require('express-session');


//sequelizeデータベースへの接続
sequelize.drop().then(() => {
    schoolM.sync().then(() => {
        creates.schools(schoolM);
        const SCHOOL_ID = {foreignKey: "schoolId"};
        teacherM.belongsTo(schoolM, SCHOOL_ID);
        schoolM.hasMany(teacherM, SCHOOL_ID);

        teacherM.sync().then(() => {
            creates.teachers(teacherM);
        });
        partyM.belongsTo(schoolM, SCHOOL_ID);
        schoolM.hasMany(partyM, SCHOOL_ID);

        partyM.sync().then(() => {
            creates.parties(partyM);

            const PARTY_ID = {foreignKey: 'partyId'};
            studentM.belongsTo(partyM, PARTY_ID);
            partyM.hasMany(studentM, PARTY_ID);

            studentM.sync().then(() => {
                creates.students(studentM);

                const STUDENT_ID = {foreignKey: "studentId"};
                const TEACHER_ID = {foreignKey: "teacherId"};
                goHome.belongsTo(studentM, STUDENT_ID);
                goHome.belongsTo(teacherM, TEACHER_ID);

                studentM.hasMany(goHome, STUDENT_ID);
                teacherM.hasMany(goHome, TEACHER_ID);

                goHome.sync().then(() => {
                    creates.goHomes(goHome);
                });

                attendance.belongsTo(studentM, STUDENT_ID);
                attendance.belongsTo(teacherM, TEACHER_ID);

                studentM.hasMany(attendance, STUDENT_ID);
                teacherM.hasMany(attendance, TEACHER_ID);

                attendance.sync().then(() => {
                    creates.attendances(attendance);
                });

            });
        });
    });
});
//ページ用変数の宣言


const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
//sessionの設定
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        secure: false,
        maxage: 1000 * 60 * 30
    }
}));

//TODO:
/**
 * ルーティングの設定
 */
//ログイン
const login = require('./routes/login');
app.use('/login', login);
const forgotPassword = require('./routes/forgotPassword');
app.use('/forgotPassword', forgotPassword);
//セッションチェック
const sessionCheck = require('./routes/sessionCheck');
app.use(sessionCheck);
const menu = require('./routes/menu');
app.use('/',menu);
//これ以降ログインが必要
app.use('/menu',sessionCheck,menu);
const teachers = require('./routes/teachers');
app.use('/contents/teachers', teachers);
const logout = require('./routes/logout');
app.use('/logout',logout);
const party = require('./routes/party');
app.use('/contents/party', party);
const student = require('./routes/student');
app.use('/contents/student', student);
const school = require('./routes/school');
app.use('/contents/school', school);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
