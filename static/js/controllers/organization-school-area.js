var selectable = require('../mixins/selectable');
var modalCRUD = require('../mixins/modal-crud');

function SchoolAreaOrganizationController($scope, $http, parsePages, uihelper) {
	var fields = ['page', 'search', 'limit'];
	var ready = true;

	$scope.page = 1;
	$scope.limit = 20;
	$scope.showPage = showPage;

	$scope.$watch('limit', watchReload);
	$scope.$watch('search', watchReload);

	this.onTabActive = reload;

	selectable($scope);
	modalCRUD($scope, {
		entity: 'schoolArea',
		entityName: '学区',
		templateUrl: '/views/system/school-area-form.html',
		modify: {title: '修改学区'},
		'delete': {confirm: true},
		doDelete: function(records){
			$http.delete('/system/nodes', {
				params: {
					obj_id: records.map(function(r){ return r.id; })
				}
			}).then(function(){
				uihelper.success("删除学区成功！");
				reload();
			}, function(){
				uihelper.fail("删除学区失败！");
			});
		}
	});

	function showPage(p) {
		reload({page: p});
		$scope.page = p;
	}

	function reload(options) {
		var params = {node_type: 'area'};
		options = options || {};
		angular.forEach(fields, function(f){
			params[f] = $scope[f];
		});
		angular.extend(params, options);
		$http.get('/system/nodes', {params: params}).then(function(resp){
			// 解析出分页需要的所有数据
			parsePages($scope, resp.data.page_info);
			$scope.records = getRecords($scope, resp.data.nodes);
		});
	}

	function watchReload(v) {
		ready && reload();
	}
}

SchoolAreaOrganizationController.$inject = ['$scope', '$http', 'parsePages', 'uihelper'];

module.exports = SchoolAreaOrganizationController;

function getRecords(scope, data) {
	// 格式化后台数据
	
	return data;
}
