// 这个文件包含所有 jQuery 相关的代码
var $ = require('../libs/jquery-2.1.1');
var uihelper = require('./services/uihelper');

window.jQuery = window.$ = $;

require('../libs/bootstrap');
require('../libs/SmartNotification.js');

function onReady() {
	$('#left-panel').children('.minifyme').click(toggleMenu);
    var timer;
	$(window).resize(function(){
        if(timer) { clearTimeout(timer); }
        timer = setTimeout(uihelper.updateGroupTreeHeight, 100);
    });
}

module.exports = function() { $(onReady); };

function toggleMenu(e) {
	var $body = $(document.body);
	if(!$body.hasClass('menu-on-top')) {
		$body.toggleClass("minified");
	}
}

