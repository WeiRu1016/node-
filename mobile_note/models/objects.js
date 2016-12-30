var mongodbUrl = require('../conf/conf').mongodb;
var mongodb = require('mongodb').MongoClient;

var Item = function(item) {
    this.type = item.type;
    this.category = item.category;
    this.money = item.money;
    if (item.date) {
        this.date = this.dateInitial(new Date(item.date));
    } else {
        this.date = this.dateInitial(new Date());
    }
}
module.exports = Item;

/**插入一条数据**/
Item.prototype.insertOne = function(item, callback) {
    mongodb.connect(mongodbUrl, function(err, db) {
        if (err) {
            callback(err);
        }
        var collection = db.collection('item');
        // var itemObj = new Item();
        collection.insertOne(item, function(err, docs) {
            db.close();
            callback(err, docs);
        });
    });
};
/*
更新一条数据
*/
Item.prototype.updateOne = function(id, item, callback) {
    mongodb.connect(mongodbUrl, function(err, db) {
        if (err) {
            callback(err);
        }
        var collection = db.collection('item');
        collection.updateOne({ _id: id }, { $set: item, $currentDate: { lastModified: true } }, function(err, doc) {
            db.close();
            callback(err, doc);
        });
    });
};
/*
获取所有数据
*/
Item.prototype.getAll = function(callback) {
    var that = this;
    mongodb.connect(mongodbUrl, function(err, db) {
        if (err) {
            callback(err, null);
        }
        var collection = db.collection('item');
        collection.aggregate([{ $group: { _id: "$date", item: { $push: { _id: "$_id", type: "$type", category: "$category", money: "$money", date: "$date" } } } }]).sort({ '_id': -1 }).toArray(function(err, docs) {
            db.close();
            var list = [];
            docs.forEach(function(ele, index) {
                var temp = [];
                for (var i = 0; i < ele.item.length; i++) {
                    var obj = ele.item[i];
                    temp.push(new Item(obj.type, obj.category, obj.money, obj.date));
                }
                list.push({
                    date: that.formatDate(ele._id),
                    items: temp
                });
            });
            callback(err, list);
        });
        // collection.find({}).sort({ "date": -1 }).toArray(function(err, docs) {
        //     db.close();
        //     callback(err, docs);
        // });
        // collection.aggregate([{ $group: { _id: "$date", money: { "$push": { "type": "$type", "category": "$category", "money": "$money" } } } }]).sort('_id': -1).toArray(function(err, docs) {
        //     db.close();
        //     console.log(docs);
        //     callback(err, docs);
        // });
    });
};
/*获取某一日期下的所有数据*/
Item.prototype.getGroupDate = function(date, callback) {
    mongodb.connect(mongodbUrl, function(err, db) {
        if (err) {
            callback(err, null);
        }
        var select = {
            date: this.dateInitial(new Date(date))
        };
        var collection = db.collection('item');
        collection.find(select).toArray(function(err, docs) {
            db.close();
            console.log(docs);
            var lists = [];
            docs.forEach(function(ele, index) {
                lists.push(new Item(ele.type, ele.category, ele.money, ele.date));
            });
            callback(err, lists);
        });
    });
};
/*find方法 */
Item.prototype.getMany = function(query, callback) {
    var select = {};
    if (query && query.type) {
        select.type = query.type;
    }
    if (query && query.category) {
        select.category = query.category;
    }
    if (query && query.date) {
        select.date = query.date;
    }
    mongodb.connect(mongodbUrl, function(err, db) {
        if (err) {
            callback(err, null);
        }
        var collection = db.collection('item');
        collection.find(select).toArray(function(err, docs) {
            db.close();
            console.log(docs);
            var lists = [];
            docs.forEach(function(ele, index) {
                lists.push(new Item(ele.type, ele.category, ele.money, ele.date));
            });
            callback(err, lists);
        });
    });
};
Item.prototype.getOne = function(query, callback) {
    mongodb.connect(mongodbUrl, function(err, db) {
        if (err) {
            callback(err, null);
        }
        var collection = db.collection('item');
        collection.find(query).toArray(function(err, doc) {
            db.close();
            var item = new Item(doc.type, doc.category, doc.money, doc.date);
            callback(err, item);
        });
    });
};
/*格式化时间为：YYYY/MM/DD */
Item.prototype.formatDate = function(date) {
    console.log(this.date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [year, month, day].join('/');
};
/*格式化时间:new Date()时分秒均为0 */
Item.prototype.dateInitial = function(date) {
    var year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate();
    return new Date(year, month, day);
};