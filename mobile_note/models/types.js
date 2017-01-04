var mongoose = require('./mongodb').mongoose;
var data = require('../conf/typeData');
var TypeSchema = new mongoose.Schema({
    // type: { type: String, enum: ['in', 'out'] },
    // typeName: { type: String, enum: ['收入', '支出'] },
    type: String,
    typeName: String,
    subType: []
});
var TypeModel = mongoose.model('type', TypeSchema);
var typeDao = function() {};
typeDao.prototype.getAll = function(callback) {
    TypeModel.find({}, function(err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(err, docs);
        }
    });
};
typeDao.prototype.getSubType = function(query, callback) {
    var type = query.type,
        subType = query.subType;
    TypeModel.findOne({ type: type }, function(err, docs) {
        if (err) {
            return callback(err);
        }
        var subTypeArr = docs.subType;
        for (var i = 0; i < subTypeArr.length; i++) {
            if (subTypeArr[i].type == subType) {
                return callback(err, subTypeArr[i]);
            }
        }
        return callback(err, null);
    });
};
typeDao.prototype.init = function() {
    for (var i = 0; i < data.length; i++) {
        TypeModel.create(data[i], function(err, docs) {
            if (err) {
                console.log('错误：', err);
                return;
            } else {
                console.log('数据：', docs);
            }
        });
    }
}
module.exports = new typeDao();