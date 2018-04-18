function schoolAreaDirective() {
	return {
		restrict: 'EA',
		replace: true,
		controller: 'SchoolAreaController',
		template: '<div class="form-group"><label>学区：</label>' +
			'<select ng-model="area" class="form-control" ng-options="o.node_name for o in areas">' +
			'  <option value="">所有学区</option>' +
			'</select></div>'
	};
}

schoolAreaDirective.$inject = [];

module.exports = schoolAreaDirective;