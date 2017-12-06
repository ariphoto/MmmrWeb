var express = require('express');
var router = express.Router();


//TODO:


router.get('/add', function(req, res, next) {
    res.render('contents/student/add', { title: '園児追加' });
});
router.get('/edit', function(req, res, next) {
    res.render('contents/student/edit', { title: '園児編集' });
});
router.get('/list', function(req, res, next) {
    var query = "SELECT id,picturePath,name,phonetic,gender,partyId,birthDay" +
        " FROM student;;";
    connection.query(query, function(err, results, fields) {
        return res.render('contents/student/list', { title: '園児一覧' , 'data': results});
    });
    //res.render('contents/student/list', { title: '園児一覧' });
});
module.exports = router;
