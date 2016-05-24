#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');

program
    .version('0.0.1')
    .usage('<keywords>')
    .parse(process.argv);

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

if(!program.args.length) {
	fs.readFile('combine.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  var obj = JSON.parse(data);
	  if(!obj.src){
	 	 console.log("未发现src配置");
	 	 return;
	  }
	  if(!obj.target){
	 	 console.log("未发现target配置");
	 	 return;
	  }
	  if(!isArray(obj.src)){
	 	 console.log("src应该是一个数组");
	 	 return;
	  }
	  for(var key in obj.src) {
	  	var name = obj.src[key];
		if (!fs.existsSync(name)) {
	  		console.log(name+"不存在");
	  		return;
		}
	  }

	  fs.exists(obj.target, function(exists) {
		  if(exists) {
	  		fs.unlink(obj.target);
		  }
		  for(var key in obj.src) {
	  		var name = obj.src[key];
			var luaData = fs.readFileSync(name, 'utf-8');
			fs.appendFileSync(obj.target, luaData);
		  }
		  console.log("合成完毕");
	  });

	});
} else {
    console.log('Keywords: ' + program.args);   
}
