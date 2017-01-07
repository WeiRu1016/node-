var express = require('express');
var router = express.Router();
var EntryModel = require('../models/entry');

router.get('/:date', function(req, res, next) {
    EntryModel.find({ date: new Date(req.params.date) }, function(err, docs) {
        if (err) {
            console.log('错误', err);
            return res.redirect('back');
        } else {
            console.log('明细：', docs);
            res.render('detail', {
                title: '明细',
                lists: docs,
                date: req.params.date
            });
        }
    })
});
module.exports = router;