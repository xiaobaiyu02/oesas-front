var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
var ipv6Block = /^[0-9A-F]{1,4}$/i;

/*
 * ip 指令
 */
function VIPDirective() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, elm, attr, ctrl) {
			if (!ctrl) return;
			ctrl.$validators.ip = function(modelValue, viewValue) {
				return ctrl.$isEmpty(viewValue) || isIP4(viewValue);
			};
		}
	};
}

VIPDirective.$inject = [];
module.exports = VIPDirective;

function isIP4(str) {
	if (!ipv4Maybe.test(str)) {
		return false;
	}
	var parts = str.split('.').sort(function (a, b) {
		return a - b;
	});
	return parts[3] <= 255;
}

function isIP6() {

}