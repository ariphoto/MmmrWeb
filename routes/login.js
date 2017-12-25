const express = require('express');
const router = express.Router();

/* GET home page. */
//TODO:
router.get('/', function(req, res, next) {
    res.render('login', { title: 'ログイン' });
});

module.exports = router;