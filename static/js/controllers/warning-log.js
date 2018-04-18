function WarningLogController($scope, $http, parsePages) {
	var fields = ['page', 'limit', 'node_type', 'node_name', 'school_type', 'search'];
	var ready = false;

	$scope.page = 1;
	$scope.limit = 30;
	$scope.showPage = showPage;
	$scope.$on('node:change', function(e, node){
		$scope.node_type = node.node_type;
		$scope.node_name = node.node_name;
		reload();
		ready = true;
	});

	$scope.$watch('school_type', watchReload);
	$scope.$watch('search', watchReload);
	$scope.$watch('limit', watchReload);

	function showPage(p) {
		reload({page: p});
		$scope.page = p;
	}

	function reload(options) {
		var params = {};
		options = options || {};
		angular.forEach(fields, function(f){
			params[f] = $scope[f];
		});
		if(params.school_type) {
			params.school_type = params.school_type.id;
		}
		angular.extend(params, options);
		$http.get('/dashboard/alarminfo/list', {params: params}).then(function(resp){
			// 解析出分页需要的所有数据
			parsePages($scope, resp.data.page_info);
			$scope.logs = getRecords($scope, resp.data.alarm_info);
		});
	}

	function watchReload(v) {
		ready && reload();
	}
}

WarningLogController.$inject = ['$scope', '$http', 'parsePages'];

module.exports = WarningLogController;

function getRecords(scope, data) {
	return data;
}
