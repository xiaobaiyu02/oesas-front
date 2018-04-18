function AreaIP() {
	return {
		restrict: 'EA',
		replace: true,
		// controller: 'AreaIPController',
		template: '<div class="form-group"><label>主机IP：</label>' +
			'<select ng-model="ip" ng-change="reloadBySchoolType(ip)" class="form-control" ng-options="t for t in ips"></select>' +
			'</div>'
	};
}

AreaIP.$inject = [];
module.exports = AreaIP;