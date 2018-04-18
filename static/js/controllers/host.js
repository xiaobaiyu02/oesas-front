function HostController($scope, $http, parsePages) {
	var fields = ['page', 'limit', 'node_type', 'node_name', 'school_type', 'school_name'];
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
	$scope.$watch('school_name', watchReload);
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
		$http.get('/dashboard/profile', {params: params}).then(function(resp){
			// 解析出分页需要的所有数据
			parsePages($scope, resp.data.page_info);
			$scope.hosts = getRecords($scope, resp.data.hosts_info);
		});
	}

	function watchReload(v) {
		ready && reload();
	}
}

HostController.$inject = ['$scope', '$http', 'parsePages'];

module.exports = HostController;

function getRecords(scope, data) {
	// 格式化后台数据
	angular.forEach(data, function(h){
		h.instance_rate = h.instance_cnt * 100 / h.instance_total;
		h.instance_color = colorLevel(h.instance_rate);

		h.cpu_rate = 100 - h.cpu_idle;
		h.cpu_color = colorLevel(h.cpu_rate);

		h.mem_rate = h.memory_gb_used * 100 / h.memory_gb;
		h.mem_color = colorLevel(h.mem_rate);

		h.disk_gb = Math.round(h.disk_gb);
		h.disk_rate = h.disk_gb_used * 100 / h.disk_gb;
		h.disk_color = colorLevel(h.disk_rate);
	});
	return data;
}

function colorLevel(v) {
	if(v >= 80) {
		return '#f10707';
	} else if(v >= 60) {
		return '#fdcb01';
	} else {
		return '#00ba00';
	}
}