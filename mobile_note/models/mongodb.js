var mongoose = require('mongoose');
var dbConf = require('../conf/conf');
mongoose.connect(dbConf.mongodb);
exports.mongoose = mongoose;