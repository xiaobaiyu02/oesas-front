var browserify = require('browserify');
var express = require('express');
var chokidar = require('chokidar');
var debug = require('debug')('dev:bundle');
var path = require('path');

var config = require('../config');
var router = express.Router();

var projectRoot = path.join(__dirname, '../');
var watcher = startWatcher();
var allBundles = initBundle();

updateCache();

module.exports = router;

function initBundle() {
	var key, obj, bundleList = [], bundle, bundleUrl, src, dest;
	if(!config.bundle) {
		console.error("没有在 package.json 中找到 \"bundle\" 字段");
		return;
	}
	for(key in config.bundle) {
		obj = config.bundle[key];
		src = obj.src;
		if(!path.isAbsolute(obj.src)) {
			src = path.join(projectRoot, src);
		}
		bundle = createBundle(key, src);
		dest = obj.dest;
		if(!path.isAbsolute(dest)) {
			dest = path.join(projectRoot, dest);
		}
		if(!path.isAbsolute(config.static_directory)) {
			config.static_directory = path.join(projectRoot, config.static_directory);
		}
		bundleUrl = path.join(config.static_prefix, dest.replace(config.static_directory, ''));
		debug('bundle url:', bundleUrl);
		router.get(bundleUrl, createRoute(bundle));
		bundleList.push(bundle);
	}
	return bundleList;
}

function createBundle(name, src) {
	var obj = {}, watchedFiles = {};
	var builder = browserify(src, {
		basedir: projectRoot
	});
	builder.on('file', function(file){
		if(!watchedFiles.hasOwnProperty(file)) {
			watchedFiles[file] = true;
			watcher.add(file);
			debug('watch file: [' + name + ']', file);
		}
	});
	return {
		name: name,
		builder: builder,
		files: watchedFiles
	};
}

function createRoute(bundle) {
	return function(req, resp){
		var prevDate = req.get('if-modified-since') || 0;
		// 说明：如果浏览器端禁用了缓存，将看不到缓存的效果
		if(bundle.lastModified > prevDate) {
			resp.set('Last-Modified', new Date(bundle.lastModified));
			resp.type('js');
			resp.end(bundle.cache);
		} else {
			resp.status(304).end();
		}
	};
}

function startWatcher() {
	var watcher = chokidar.watch([]);
	watcher.on('change', updateCache);
	return watcher;
}

function updateCache(path, type) {
	if(path) {
		debug("file changed:", path);
	}
	allBundles.forEach(function(bundle, i){
		if(path) {
			if(!bundle.files.hasOwnProperty(path)) {
				return;
			}
		}
		debug('[' + i + '] update cache for bundle ' + bundle.name);
		bundle.builder.bundle(function(err, buf){
			if(err) { throw err; }
			bundle.cache = buf;
			bundle.lastModified = Date.now();
			debug('[' + i + '] update cache for bundle ' + bundle.name + ' success!');
		});
	});
}