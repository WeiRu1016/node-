var mongodbUrl = require('../conf/conf').mongodb;
var mongodb = require('mongodb').MongoClient;

var Item = function(type,category,money,date){
	this.type = type;
	this.category = category;
	this.money = money;
	if(date){
		this.date = this.formatDate(new Date(date));
	}else{
		this.date = this.formatDate(new Date());
	}
}
module.exports = Item;

/**插入一条数据**/
Item.prototype.save = function(callback){
	var item = {
		type:this.type,
		category:this.category,
		money:this.money,
		date:this.date
	};
	mongodb.connect(mongodbUrl,function(err,db){
		if(err){
			callback(err);
		}
		var collection = db.collection('item');
		collection.updateOne({date:item.date,type:item.type,category:item.category},{$set:item},{upsert:true},function(err,docs){
			db.close();
			callback(err,docs);
		});
	});
};
Item.prototype.getAllTime = function(date){
	if(!date){
		date = new Date();
	}
	date = this.formatDate(new Date(date));
	mongodb.connect(mongodbUrl,function(err,db){
		if(err){
			callback(err,null);
		}
		var collection = db.collection('item');
		collection.aggregate([{$group:{_id:"$date",money:{"$push":{"type":"$type","category":"$category","money":"$money"}}}}]).sort('_id':-1).toArray(function(err,docs){
			db.close();
			console.log(docs);
			callback(err,docs);
		});
	});
};
Item.prototype.getGroupDate = function(date,callback){
	mongodb.connect(mongodbUrl,function(err,db){
		if(err){
			callback(err,null);
		}
		var select = {
			date:date
		};
		var collection = db.collection('item');
		collection.find(select).toArray(function(err,docs){
			db.close();
			console.log(docs);
			var lists = [];
			docs.forEach(function(ele,index){
				lists.push(new Item(ele.type,ele.category,ele.money,ele.date));
			});
			callback(err,lists);
		});
	});
};
Item.prototype.getOne = function(query,callback){
	var select = {};
	if(query && query.type){
		select.type = query.type;
	}
	if(query &&	query.category){
		select.category = query.category;
	}
	if(query &&	query.date){
		select.date = query.date;
	}
	mongodb.connect(mongodbUrl,function(err,db){
		if(err){
			callback(err,null);
		}
		var collection = db.collection('item');
		collection.find(select).toArray(function(err,docs){
			db.close();
			console.log(docs);
			var lists = [];
			docs.forEach(function(ele,index){
				lists.push(new Item(ele.type,ele.category,ele.money,ele.date));
			});
			callback(err,lists);
		});
	});
};
Item.prototype.formatDate = function(date){
	console.log(this.date);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	console.log("年：",year);
	console.log("月：",month);
	return [year,month,day].join('/');
}