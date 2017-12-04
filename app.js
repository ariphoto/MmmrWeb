var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql'); // MySQLを使用
var helmet = require('helmet'); // helmet(セキュリティ対策)

//ページ用変数の宣言

var login = require('./routes/login');
var menu = require('./routes/menu');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

//TODO:
var teachers = require('./routes/teachers');
app.use('/contents/teachers', teachers);
var party = require('./routes/party');
app.use('/contents/party', party);
var student = require('./routes/student');
app.use('/contents/student', student);
var school = require('./routes/school');
app.use('/contents/school', school);

var forgotPassword = require('./routes/forgotPassword');
app.use('/forgotPassword', forgotPassword);
//localhost下のurlでパス忘れたときにアクセス

app.use('/login', login);
app.use('/menu', menu);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

// MySQL接続設定
const connection = mysql.createConnection({
    host: '192.168.20.224',
    user: 'keijiban',
    password: '114514',
    database: 'mimamori'
});

// MySQL接続処理
connection.connect(function(err) {
    if (err) {
        return console.error('error connecting: ' + err.stack)
    }else{
        console.log('connected as id ' + connection.threadId)
    }
});

// グローバル変数として設定
global.connection = connection;


module.exports = app;
