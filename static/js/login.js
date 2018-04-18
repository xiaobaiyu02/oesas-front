var jQuery = require('../libs/jquery-2.1.1');
var $ = jQuery;
$.ajaxSetup({
	contentType: 'application/json',
	beforeSend: function(xhr, settings){
		xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
	}
});
require('../libs/SmartNotification');

var usernameRe = /^[a-z0-9]{2,20}$/i;
var passwordRe = /^[a-z0-9]{6,20}$/i;

var form = $("#login-form");
form.on("submit", function(e){
	e.preventDefault();
	if(!usernameRe.test(this.username.value)) {
		updateError.call(this.username);
		this.username.focus();
		return ;
	}
	if(!passwordRe.test(this.password.value)) {
		updateError.call(this.password);
		this.password.focus();
		return ;
	}
	var xhr = $.post("/auth/login", JSON.stringify({
		username: this.username.value,
		password: this.password.value
	})).success(function(){
		if(xhr.status >= 200 && xhr.status < 300) {
			location.replace("/");
		} else {
			showAlert("错误", "登录失败");
		}
	}).fail(function(){
        if(xhr.responseJSON) {
            showAlert("错误", xhr.responseJSON.errors);
        } else {
    		showAlert("错误", "网络错误");
        }
	});
});

$.each(['username', 'password'], function(i, s){
	$(form[0][s]).on('input', updateError);
});

function updateError() {
	var element = $(this), errstr, t;
	errstr = getInputError(this.value, this.type);
	t = element.next('.tooltip').children('span');
	t.html(element.attr('data-label') + (errstr ? ':' + errstr : ''));
}

function getInputError(s, type) {
    if(type === "password") {
        if(s.length < 6) {
            return "最少 6 个字符";
        }
    } else {
        if(s.length < 2) {
            return "最少 2 个字符";
        }
    }
	if(!/^[a-z0-9]+$/.test(s)) {
		return "只能是数字、字母";
	}
	if(s.length > 20) {
		return "最多 20 个字符";
	}
	return null;
}

function showAlert(title, msg) {
	$.bigBox({
		title : title,
		content : msg,
		color : "#C46A69",
		icon : "fa fa-warning shake animated",
		timeout : 6000
	});
}

function getCookie(k) {
	var items = document.cookie.split(';')
	var prefix = k + '=', value;
	$.each(items, function(i, s){
		if(s.indexOf(prefix) === 0) {
			value = s.replace(prefix, '');
			return false;
		}
	});
	return value;
}
