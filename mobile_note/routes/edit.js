var express = require('express');
var router = express.Router();
var EntryModel = require('../models/entry');
var type = require('../models/types');
var selectType = null;
// var ItemModel = require('../models/objects');
// var type = require('../models/type');
router.get('/change/:id', function(req, res, next) {
    type.getAll(function(err, types) {
        if (err) {
            console.error('错误：', err);
            return;
        }
        if (req.params.id) {
            EntryModel.getOne({ _id: req.params.id }, function(err, doc) {
                if (err) {
                    console.error('错误：', err);
                    return;
                }
                return res.render('edit', {
                    title: '修改',
                    item: doc,
                    typeList: types,
                    selectType: doc
                });
            });
        } else {
            return res.render('edit', {
                title: '添加',
                item: null,
                typeList: types,
                selectType: null
            });
        }
    });
});
router.get('/add', function(req, res, next) {
    // type.init();
    type.getAll(function(err, types) {
        console.log("aaaaa");
        console.log(types);
        if (err) {
            console.error('错误：', err);
            return;
        }
        if (req.params.id) {
            EntryModel.findOne({ _id: req.params.id }, function(err, doc) {
                if (err) {
                    console.error('错误：', err);
                    return;
                }
                return res.render('edit', {
                    title: '修改',
                    item: doc,
                    typeList: types,
                    selectType: doc
                });
            });
        } else {
            return res.render('edit', {
                title: '添加',
                item: null,
                typeList: types,
                selectType: selectType
            });
        }
    });
});
router.get('/type', function(req, res, next) {
    var queryType = req.query.type,
        quertSubType = req.query.subtype;
    console.log('请求参数：', req.query);
    type.getSubType({ type: queryType, subType: quertSubType }, function(err, doc) {
        console.log(doc);
        // selectType = doc;
        // res.locals.selectType = doc;
        selectType = res.locals.selectType = {
            type: queryType,
            subType: doc.type,
            typeName: doc.typeName
        }
        res.jsonp(selectType);
    });
});
router.post('/', function(req, res, next) {
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
// router.get('/:id', function(req, res, next) {
//     type.prototype.getAll(function(err, types) {
//         if (err) {
//             console.error('错误：', err);
//             return;
//         }
//         console.log("iddddddddd:", req.params.id);
//         console.log(req.params.id == -1);
//         console.log(req.params.id == "-1");
//         console.log(isNaN(Number(req.params.id)));
//         if (!isNaN(Number(req.params.id))) {
//             console.log("aaaaaaa");
//             if (req.params.id == -1) {
//                 console.log(types);
//                 return res.render('edit', {
//                     title: '添加',
//                     item: null,
//                     typeList: types
//                 });
//             } else {
//                 ItemModel.prototype.getOne({ _id: req.params.id }, function(err, doc) {
//                     if (err) {
//                         console.error('错误：', err);
//                         return;
//                     }
//                     return res.render('edit', {
//                         title: '修改',
//                         item: doc,
//                         typeList: types
//                     });
//                 });
//             }
//         }
//     });
// });
module.exports = router;