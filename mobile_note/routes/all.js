var express = require('express');
var router = express.Router();
var index = require('./index');
var timeline = require('./timeline');
var edit = require('./edit');
// require('../models/type').prototype.init();

module.exports = function(app) {
    app.use('/detail', require('./detail'));
    app.use('/edit', require('./edit'));
    app.use('/', require('./timeline'))
};