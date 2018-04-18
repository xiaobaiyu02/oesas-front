var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Mock = require('mockjs');

var app = express();

var config = require('./config');

var pageDir = config.page_directory;
var viewDir = config.view_directory;
var staticDir = config.static_directory;

if(!path.isAbsolute(pageDir)) {
	pageDir = path.join(__dirname, pageDir);
}

if(!path.isAbsolute(viewDir)) {
	viewDir = path.join(__dirname, viewDir);
}

if(!path.isAbsolute(staticDir)) {
	staticDir = path.join(__dirname, staticDir);
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 默认情况，先检测请求是否有对应的路由，如果没有将请求映射到本地文件
app.use(require('./routes/index'));
app.use(require('./routes/bundle'));

// 静态资源文件映射路径

// 单独完整的页面文件
app.use(config.page_prefix, function(req, resp, next){
	var pathname = req.path, q = req.query, pagefile;
	if(pathname === "/") {
		pathname = "/index.html";
	}
	if(pathname.indexOf('/dev/') === 0) {
		resp.redirect(pathname.replace('/dev', ''));
		return;
	}
	// 加载正式页面
	if(/^off|0|false|no$/.test(q.dev) || /^on|1|true|yes$/.test(q.production)) {
		pagefile = pathname;
	} else {
		pagefile = '/dev' + pathname;
	}
	pagefile = path.join(pageDir, pagefile);
	fs.lstat(pagefile, function(err, stat){
		if(stat && stat.isFile()) {
			resp.sendFile(pagefile);
		} else {
			next();
		}
	});
});

// 模板文件，由于使用 angular 框架，跟模板打交道比较多，专门为模板配置一个路由
app.use(config.view_prefix, express.static(viewDir));

// 页面所需要的静态资源文件，css, js, images 等等
app.use(config.static_prefix, express.static(staticDir));

// angular docs
app.use('/angular', express.static(path.join(__dirname, 'static/libs/angular-1.4.7')));
// 不是上面的情况，就是页面在运行过程中发出的 ajax 请求，尝试将这些请求映射到本地文件
// 映射规则：
//   request.url => <project_root>/ajax/<request.url>
// 映射的时候，优先根据 request.method 来查找文件
app.use(function(req, resp, next){
	ajax2local(req, function(e, file){
		if(e) {
			resp.status(500).json({info: e.message, status: false});
		} else {
			fs.readFile(file, 'utf-8', function(e, content){
				if(e) {
					return resp.status(500).json({info: '读取文件 ' + file + ' 失败', status: false});
				}
				// generate mock data
				var data = JSON.parse(content);
				if(req.query.page && data.page_info) {
					data.page_info.page = req.query.page * 1;
				}
				resp.json(Mock.mock(data));
			});
		}
	});
});

var supportedSuffix = /\.json$/i;

function ajax2local(request, callback) {
	var pathname = request.path, parts = pathname.split('/'), dirpart, namepart;
	if(parts[parts.length - 1] === '/') {
		parts.pop();
	}
	namepart = parts.pop();
	dirpart = parts.join('/');
	var dir = path.join(__dirname, 'ajax', dirpart), prefername = request.method.toLowerCase() + '-' + namepart;
	fs.readdir(dir, function(e, files){
		if(e) {
			return callback(e);
		}
		files = files.filter(function(f){
			return supportedSuffix.test(f);
		});
		var arr = [], i = 0, len = files.length;
		for(;i<len;i++) {
			if(files[i].indexOf(prefername) > -1) {
				arr.push(files[i]);
			}
		}
		if(arr.length > 0) {
			return callback(null, path.join(dir, arr[0]));
		}
		for(i=0;i<len;i++) {
			if(files[i].indexOf(namepart) > -1) {
				arr.push(files[i]);
			}
		}
		if(arr.length > 0) {
			callback(null, path.join(dir, arr[0]));
		} else {
			callback(new Error("还没有实现！"));
		}
	});
	return [dirpart + '/' + request.method.toLowerCase() + '-' + namepart, dirpart + '/' + namepart];
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
