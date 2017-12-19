'use strict';

const express = require('express');
const router = express.Router();

router.get('/',sessionCheck);

// loginしてる場合はindex pageへ、してない場合はlogin pageへ
function sessionCheck(req, res, next) {
    if (req.session.user){
        res.render('',{title: req.session.user.name})
    }else {
        res.redirect('/login');
    }
}
module.exports= router;