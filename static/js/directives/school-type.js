function schoolTypeDirective() {
	return {
		restrict: 'EA',
		replace: true,
		controller: 'SchoolTypeController',
		template: '<div class="form-group"><label>学校类型：</label>' +
			'<select ng-model="school_type" class="form-control" ng-options="t.name for t in types">' +
			'  <option value="">所有类别</option>' +
			'</select></div>'
	};
}

schoolTypeDirective.$inject = [];

module.exports = schoolTypeDirective;