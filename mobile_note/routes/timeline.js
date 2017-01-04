var express = require('express');
var router = express.Router();
// var ItemModel = require('../models/objects');
var EntryModel = require('../models/entry');
router.get('/', function(req, res, next) {
    EntryModel.find({}, function(err, docs) {
        EntryModel.getAll(function(err, list) {
            if (err) {
                console.error("错误", err);
                return res.redirect('/');
            }
            console.log('列表：', list);
            list.forEach(function(ele, index) {
                ele._id = EntryModel.formatDate(ele._id);
            });
            return res.render('timeline', {
                title: '首页',
                list: list
            });
        });
    });

    // ItemModel.prototype.getAll(function(err, list) {
    //     if (err) {
    //         console.error("错误", err);
    //         return res.redirect('/');
    //     }
    //     return res.render('timeline', {
    //         title: '首页',
    //         list: list
    //     });
    // });
});
module.exports = router;