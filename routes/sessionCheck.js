'use strict';

// loginしてる場合はmenuへ、してない場合はlogin pageへ
const sessionCheck = (req, res, next) => {
    if (req.session.schoolId) {
        next();
        // {schoolName:req.session.name}
    } else {
        res.redirect('/login');
    }
};
module.exports = sessionCheck;