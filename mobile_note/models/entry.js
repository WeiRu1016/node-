var moment = require('moment');
var mongoose = require('./mongodb').mongoose;
var entrySchema = new mongoose.Schema({
    type: { type: String, enum: ['out', 'in'] },
    category: { type: String, enum: ['in', 'buy', 'cloth', 'traffic', 'house', 'food', 'other'] },
    money: Number,
    typeName: String,
    date: Date
});
var EntryModel = mongoose.model('entry', entrySchema);
var entryDao = function() {};
//查询数据
entryDao.prototype.find = function(query, callback) {
    var that = this;
    EntryModel.find(query, function(err, docs) {
        if (err) {
            return callback(err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                docs[i] = docs[i].toObject();
                docs[i].date = that.formatDate(docs[i].date);
            }
            return callback(err, docs);
        }
    });
};
//查询一条数据
entryDao.prototype.getOne = function(query, callback) {
    var that = this;
    EntryModel.findOne(query, function(err, doc) {
        if (err) {
            return callback(err);
        } else {
            if (doc) {
                doc = doc.toObject();
                doc.date = that.formatDate(doc.date);
            }
            return callback(err, doc);
        }
    });
};
//插入一条数据
entryDao.prototype.insertOne = function(obj, callback) {
    console.log('插入：', obj);
    EntryModel.create(obj, function(err, doc) {
        if (err) {
            return callback(err);
        } else {
            return callback(err, doc);
        }
    });
};
//更新一条数据
entryDao.prototype.updateOne = function(id, item, callback) {
    EntryModel.update({ _id: id }, { $set: item }, function(err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(err, docs);
        }
    });
};
entryDao.prototype.getAll = function(callback) {
    EntryModel.aggregate([{
        $match: {

        }
    }, {
        $project: {
            'date': '$date',
            '_id': '$_id',
            'type': '$type',
            'category': '$category',
            'money': '$money',
            'typeName': '$typeName'
        }
    }, {
        $group: {
            _id: '$date',
            item: {
                $push: {
                    '_id': '$_id',
                    'type': '$type',
                    'category': '$category',
                    'money': '$money',
                    'typeName': '$typeName'
                }
            }
        }
    }, {
        $sort: { '_id': 1 }
    }]).exec(function(err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(err, docs);
        }
    });
};
/*格式化时间为：YYYY/MM/DD */
entryDao.prototype.formatDate = function(date) {
    console.log(date);
    date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [year, month, day].join('.');
};
/*格式化时间:new Date()时分秒均为0 */
entryDao.prototype.dateInitial = function(date) {
    var year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate();
    return new Date(year, month, day);
};
module.exports = new entryDao();