var mongodbUrl = require('../conf/conf').mongodb;
var mongodb = require('mongodb').MongoClient;
var typeData = require('../conf/typeData');

var Type = function(typeObj) {
    this.type = typeObj.type;
    this.typeName = typeObj.typeName;
    this.subType = [];
    var that = this;
    if (typeObj.subType) {
        typeObj.subType.forEach(function(ele, index) {
            that.subType.push(new Type(ele));
        });
    }
}
module.exports = Type;
Type.prototype.getAll = function(callback) {
    mongodb.connect(mongodbUrl, function(err, db) {
        if (err) {
            callback(err);
            return;
        }
        var collection = db.collection('type');
        var list = [];
        collection.find({}).toArray(function(err, docs) {
            docs.forEach(function(ele, index) {
                var sub = [];
                ele.subType.forEach(function(itemObj, i) {
                    sub.push(new Type(itemObj));
                });
                list.push(new Type({
                    type: ele.type,
                    typeName: ele.typeName,
                    subType: sub
                }));
            });
            callback(err, list);
        });
    });
};
Type.prototype.insertMany = function(data, callback) {
    mongodb.connect(mongodbUrl, function(err, db) {
        if (err) {
            callback(err);
            return;
        }
        var collection = db.collection("type");
        collection.insertMany(data, function(err, docs) {
            callback(err, docs);
        });
    });
};
Type.prototype.init = function() {
    this.insertMany(typeData, function(err, callback) {
        if (err) {
            console.error('错误：', err);
            return;
        }
        console.log('初始化成功！');
    });
}