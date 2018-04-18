function TimeRangeDirective() {
	return {
		restrict: 'EA',
		replace: true,
		template: '<div class="form-group"><label>选择时间：</label>' +
			'<select ng-model="method" ng-change="setTimeRange(method)" class="form-control">' +
			'  <option value="week">近一周</option>' +
			'  <option value="month">近一月</option>' +
			'  <option value="3month">近三月</option>' +
			'  <option value="">自定义时间</option>' +
			'</select></div>'
	};
}

TimeRangeDirective.$inject = [];

module.exports = TimeRangeDirective;