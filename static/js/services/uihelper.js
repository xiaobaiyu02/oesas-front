var templateRequest;

function UIService($templateRequest){
	templateRequest = $templateRequest;
	return {
		openModal: openModal,
		setupForm: setupForm,
		confirm: confirm,
		modal_confirm: modal_confirm,
		success: success,
		fail: fail,
		onViewLoad: onViewLoad
	};
}

UIService.$inject = ['$templateRequest'];

module.exports = UIService;
module.exports.updateGroupTreeHeight = updateGroupTreeHeight;

function openModal(url, options){
	options = options || {};
	// 强制初始化就显示
	options.show = true;
	return templateRequest(url).then(function(tmpl){
		var el = $(tmpl), body = $(document.body);
		body.append(el);
		el.modal(options);
		el.on('hidden.bs.modal', function(){
			el.remove(); el = null;
		});
		body.injector().invoke(['$compile', '$rootScope', function($compile, $rootScope){
			$compile(el)($rootScope);
		}]);
		
		return el;
	});
}

function setupForm(formEl, options) {
	var values;
	options = angular.merge({}, {
		tooltip: {
			html: true,
			placement: 'top',
			trigger: 'manual'
		}
	}, options);
	values = options.values || {};
	formEl.find('.form-control').each(function(){
		var $input = $(this);
		if($input.attr('rel') !== "tooltip") { return; }
		$input.tooltip(options.tooltip || {});
		$input.hover(showTooltip, hideTooltip);
		$input.on('input', showTooltip);
	});
	if(options.values) {
		formEl.controller().setValues(options.values);
	}
	function showTooltip(e) {
		var me = $(this), tip = updateTooltip(me), obj;
		if(tip) {
			obj = me.data('bs.tooltip');
			if(obj.tip().is(':visible')) {
				obj.tip().find('.tooltip-inner')[obj.options.html ? 'html' : 'text'](tip);
			} else {
				me.tooltip('show');
			}
		} else {
			me.tooltip('hide');
		}
	}
	function hideTooltip() {
		$(this).tooltip('hide');
	}
}

function confirm(options) {
	$.SmartMessageBox({
		title: options.title || '提示',
		content: options.content,
		buttons: '[取消][确定]'
	}, options.callback ? function(btn){
		options.callback(btn === "确定");
	} : null);
}

function modal_confirm(options) {
	options = options || {};
	options.title = options.title || "提示";
	return templateRequest("/views/confirm_modal.html").then(function(tmpl){
		var el, result = false;
		tmpl = tmpl.replace(/\{(.*?)\}/g, function(_, k){
			return options[k] || '';
		});
		el = $(tmpl);
		$(document.body).append(el);
		el.modal({show: true, keyboard: false, esc: false, backdrop: 'static'});
		el.on('click', 'button', function(e){
			if(e.target.className.indexOf('btn-primary') > -1) {
				result = true;
			}
			options.callback && options.callback(result);
		});
		el.on('hidden.bs.modal', function(){
			el.remove();
			el = null;
		});
	});
}

function onViewLoad() {
	var $viewEl = $('#content')
	updateGroupTreeHeight();
	// 查找 tab，并创建 tab
	$viewEl.find('.nav.nav-tabs').find('a').click(function(e){
		var $a = $(this), pane, hasctrl, ctrl;
		e.preventDefault();
		$a.tab('show');
		// 查找对应的 tab 内容元素，如果内容元素上有 controller，通知
		// controller tab 被激活了
		pane = $($a.attr('href'));
		if(!pane) { return; }
		hasctrl = pane.attr('ng-controller') || pane.attr('ngController');
		if(hasctrl) {
			ctrl = pane.controller();
			ctrl.onTabActive && ctrl.onTabActive();
		}
	}).end().find('.active').children('a').trigger('click');
}

function updateGroupTreeHeight() {
	var el = $('#content .view-content'), height;
	if(el.length === 0) { return; }
	height = $('#left-panel').height() - $('#ribbon').height() - 20;
	el.css('min-height', height + 'px');
}

function success(title, content) {
	if(arguments.length === 1) {
		content = title;
		title = "提示";
	}
	$.bigBox({
		title: title,
		content: content,
		color: '#739e73',
		icon: 'fa fa-warning shake animated',
		timeout: 6000
	});
}

function fail(title, content) {
	if(arguments.length === 1) {
		content = title;
		title = "提示";
	}
	$.bigBox({
		title: title,
		content: content,
		color: '#c45a69',
		icon: 'fa fa-warning shake animated',
		timeout: 6000
	});
}

function updateTooltip($el) {
	var rules = /ng-invalid-(\w+)/g, errors, tip;
	if($el.hasClass('ng-pristine') || !$el.hasClass('ng-invalid')) {
		$el.attr('data-original-title', '');
		return '';
	}
	errors = $el.attr('class').match(rules);
	errors = errors.map(function(s){ return s.substring(11); })
	errors.sort();
	errors = errors.map(function(s){
		var text;
		if(ERROR_DATA.hasOwnProperty(s)) {
			text = ERROR_DATA[s];
			if(typeof text === "function") {
				text = text($el);
			}
		} else {
			text = "约束条件不满足";
		}
		return text;
	});
	tip = '<ul><li>' + errors.join('</li><li>') + '</li></ul>';
	$el.attr('data-original-title', tip);
	return tip;
}


var ERROR_DATA = {
	required: '这个字段是必填项',
	minlength: function($el) {
		return '这个字段最短为 ' + $el.attr('ng-minlength') + ' 个字符';
	},
	maxlength: function($el) {
		return '这个字段最长为 ' + $el.attr('ng-maxlength') + ' 个字符';
	},
	number: '只能输入数字',
	email: '邮箱格式错误',
	ip: 'IP 格式不正确',
	pwdmatch: '确认密码和密码不一致'
};
