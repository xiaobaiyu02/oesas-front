#!/usr/bin/env node
/**
 * 这个文件用于合并 angular 模板文件，所有的文件合并后生成一段 js 代码
 * 代码参考下面的 `templateStr` 变量内容。
 *
 * 目前使用了 `html-minifier` 作为 HTML 压缩工具，先看看效果如何。
 *
 * 这个工具本来是应当作为 build 的一部分的，但是直接作为 build 的一部分
 * 会让 build 不够独立，如果以后切换到其它框架，那么这个部分就没用了，后
 * 面再想想。
 *
 * 为了方便目前的打包工具，先合并到 build 里面吧
 * 
 */
var minify = require('html-minifier').minify;
var config = require('../config');
var path = require('path');
var fs = require('fs');

var projectRoot = path.join(__dirname, '../');
var viewPrefix = config.view_prefix;
var viewDir = config.view_directory;
var NAME_REG = /\.html$/i;

var templateStr = '\
(function(angular, doc){\n\
	var $doc = angular.element(doc);\n\
	$doc.ready(function(){\n\
		$doc.injector().invoke(["$templateCache", function($templateCache){\n\
			angular.forEach(cacheObject, function(v, k){\n\
				$templateCache.put(k, v);\n\
			});\n\
		}]);\n\
	});\n\
})(angular, document);'

if(!path.isAbsolute(viewDir)) {
	viewDir = path.join(projectRoot, viewDir);
}

function walk(dir, out) {
	var files = fs.readdirSync(dir);
	files = files.map(function(f){
		return path.join(dir, f);
	});
	files.forEach(function(f){
		var stat = fs.lstatSync(f);
		if(stat.isFile()) {
			NAME_REG.test(f) && out.push(f);
		} else if(stat.isDirectory()) {
			walk(f, out);
		} else {
			console.log('ignore file', f.replace(projectRoot, ''));
		}
	});
}


function merge(){
	var filelist = [], views = {};
	walk(viewDir, filelist);
	filelist.forEach(function(f){
		var url = path.join(viewPrefix, f.replace(viewDir, ''));
		var content = fs.readFileSync(f, 'utf-8');
		views[url] = minify(content, {removeComments: true, collapseWhitespace: true});
	});
	return templateStr.replace('cacheObject', JSON.stringify(views));
}

function main() {
	var bundle = config.bundle.app;
	if(!bundle) { return ; }
	var file = bundle.dest, data;
	if(!path.isAbsolute(file)) {
		file = path.join(projectRoot, file);
	}
	data = merge();
	fs.appendFile(file, data);
}

if(require.main === module) {
	main();
}

module.exports = main;