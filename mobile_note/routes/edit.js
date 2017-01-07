var express = require('express');
var router = express.Router();
var EntryModel = require('../models/entry');
var type = require('../models/types');

router.get('/change/:id', function(req, res, next) {
    type.getAll(function(err, types) {
        if (err) {
            console.error('修改页面错误：', err);
            return;
        }
        if (req.params.id) {
            EntryModel.getOne({ _id: req.params.id }, function(err, doc) {
                if (err) {
                    console.error('修改页面获取item错误：', err);
                    return;
                }
                return res.render('edit', {
                    title: '修改',
                    flag: 'change',
                    typeList: types,
                    selectType: doc
                });
            });
        } else {
            return res.render('error', {
                error: {
                    status: 404,
                    stack: '请求参数错误，找不到'
                }
            });
        }
    });
});
router.get('/add', function(req, res, next) {
    var date = req.query.date;
    type.getAll(function(err, types) {
        if (err) {
            console.error('添加页面错误：', err);
            return;
        }
        return res.render('edit', {
            title: '添加',
            typeList: types,
            flag: 'add',
            selectType: null
        });
    });
});
router.post('/add', function(req, res, next) {
    console.log('取参数：', req.body);
    var type = req.body.type,
        category = req.body.category,
        money = req.body.money,
        typeName = req.body.typeName,
        date = EntryModel.dateInitial(new Date());
    EntryModel.insertOne({
        type: type,
        category: category,
        money: money,
        date: date,
        typeName: typeName
    }, function(err, doc) {
        if (err) {
            console.error('错误：', err);
            return;
        }
        console.log("postpostpostpostpostpostpostpostpostpost");
        res.jsonp({ 'code': 200 });
    });
});
router.post('/change', function(req, res, next) {
    console.log('取参数：', req.body);
    var id = req.body.id,
        type = req.body.type,
        category = req.body.category,
        money = req.body.money,
        typeName = req.body.typeName,
        date = EntryModel.dateInitial(new Date(req.body.date));
    EntryModel.updateOne(id, {
        type: type,
        category: category,
        money: money,
        date: date,
        typeName: typeName
    }, function(err, doc) {
        if (err) {
            console.error('错误：', err);
            return;
        }
        console.log("postpostpostpostpostpostpostpostpostpost");
        res.jsonp({ 'code': 200 });
    });
});
module.exports = router;