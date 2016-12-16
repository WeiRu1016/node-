var express = require('express');
var router = express.Router();
var Item = require('../models/objects'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  Item.prototype.get(null,function(err,lists){
  	if(err){
  		throw new Error("数据库错误");
  	}
  	res.render('index', { 
	  	title: 'BaoMax的记账',
	  	lists: lists
  	});
  });		
});
router.get('/',function(req,res,next){
	Item.prototype.getAllTime = function(err,data){
		if(err){
	  		throw new Error("数据库错误");
	  	}
	  	res.render('index', { 
		  	title: 'BaoMax的记账',
		  	lists: data
	  	});
	}
});
module.exports = router;
