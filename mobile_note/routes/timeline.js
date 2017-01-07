var express = require('express');
var router = express.Router();
var EntryModel = require('../models/entry');

router.get('/', function(req, res, next) {
    EntryModel.getAll(function(err, list) {
        if (err) {
            console.error("首页错误", err);
            return res.redirect('/');
        }
        console.log('首页列表：', list);
        list.forEach(function(ele, index) {
            ele._id = EntryModel.formatDate(ele._id);
        });
        return res.render('timeline', {
            title: '首页',
            list: list
        });
    });
});
module.exports = router;