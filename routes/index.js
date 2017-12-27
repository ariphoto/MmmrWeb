'use strict';

const express = require('express');
const router = express.Router();

router.get('/',sessionCheck);

// loginしてる場合はmenuへ、してない場合はlogin pageへ
function sessionCheck(req, res, next) {
    if (req.session.schoolId){
        res.render('menu',{title:req.session.schoolId})
    }else {
        res.redirect('/login');
    }
}
module.exports= router;