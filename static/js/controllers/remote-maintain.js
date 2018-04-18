function RemoteMaintainController($scope, $http, parsePages) {
	var fields = ['page', 'limit', 'node_type', 'node_name', 'school_type', 'school_name', 'search'];
	var ready = false;

	$scope.page = 1;
	$scope.limit = 20;
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
		angular.extend(params, options);
		if(params.school_type) {
			params.school_type = params.school_type.id;
		}
		$http.get('/dashboard/telemaintenance', {params: params}).then(function(resp){
			// 解析出分页需要的所有数据
			parsePages($scope, resp.data.page_info);
			$scope.records = getRecords($scope, resp.data.info);
		});
	}

	function watchReload(v) {
		ready && reload();
	}
}

RemoteMaintainController.$inject = ['$scope', '$http', 'parsePages'];

module.exports = RemoteMaintainController;

function getRecords(scope, data) {
	return data;
}
