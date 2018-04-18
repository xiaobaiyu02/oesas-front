#!/usr/bin/env node

/**
 * 这个文件用于压缩 css 及 html 文件，生成的 html 文件中文会被替换成实体（不影响）
 * 
 */
var cheerio = require('cheerio');
var CleanCss = require('clean-css');
var minifyHTML = require('html-minifier').minify;

var path = require('path');
var fs = require('fs');
var assert = require('assert');

var config = require('../config');

var staticDir = config.static_directory;
var staticPrefix = config.static_prefix;


if(!path.isAbsolute(staticDir)) {
	staticDir = path.join(__dirname, '../', staticDir);
}

function build(file, output) {
	var content = fs.readFileSync(file, 'utf-8');
	var $ = cheerio.load(content);
	var css_files = [];
	var css_bundle_name = path.basename(file, '.html') + '.bundle.min.css';
	var linkEls = $('link[rel="stylesheet"]');
	linkEls.each(function(){
		var el = $(this);
		css_files.push(el.attr('href'));
	});
	build_css(css_files, css_bundle_name).then(function(){
		var url = path.join(path.dirname(css_files[0]), css_bundle_name);
		var p = linkEls.parent();
		linkEls.remove();
		p.append('<link rel="stylesheet" type="text/css" href="' + url + '?v=' + Date.now() + '"/>');
		var html = minifyHTML($.html(), {removeComments: true, collapseWhitespace: true});
		var stream = fs.createWriteStream(output);
		stream.write('<!-- {% verbatim %} -->')
		stream.write(html);
		stream.write('<!-- {% endverbatim %} -->')
		stream.end();
	});
	$('script').each(function(){
		var el = $(this);
		el.attr('src', el.attr('src').replace(/\.js$/i, '.min.js?v=' + Date.now()));
	});
}

function build_css(files, output) {
	files = files.map(function(f){
		var fullpath = path.join(staticDir, f.replace(staticPrefix, ''));
		var stat = fs.lstatSync(fullpath);
		assert.ok(stat.isFile(), "文件 " + f + " 不存在！");
		return fullpath;
	});
	if(!path.isAbsolute(output)) {
		output = path.join(path.dirname(files[0]), output);
	}
	var source = files.map(function(f){
		return fs.readFileSync(f, 'utf-8');
	}).join('');
	return new Promise(function(resolve, reject){
		new CleanCss({
			target: output,
			keepSpecialComments: 0,
			processImport: true
		}).minify(source, function(e, result){
			if(e) {
				reject(e);
			} else {
				fs.writeFileSync(output, result.styles);
				resolve();
			}
		});
	});
}

function main() {
	var pageDir = config.page_directory;
	if(!path.isAbsolute(pageDir)) {
		pageDir = path.join(__dirname, '../', pageDir);
	}
	var devDir = path.join(pageDir, 'dev');
	var files = fs.readdirSync(devDir);
	files.forEach(function(f){
		var infile = path.join(devDir, f);
		var outfile = path.join(pageDir, f);
		build(infile, outfile);
	});
}

if(module === require.main) {
	main();
}