var selectable = require('../mixins/selectable');
var modalCRUD = require('../mixins/modal-crud');

function SchoolTypeOrganizationController($scope, $http, parsePages, uihelper) {
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
		entity: 'schoolType',
		entityName: '学校类型',
		templateUrl: '/views/system/school-type-form.html',
		modify: {title: '修改学校类型'},
		'delete': {confirm: true},
		doDelete: function(records){
			$http.delete('/system/school-type', {
				params: {obj_id: records.map(function(r){ return r.id; })}
			}).then(function(){
				uihelper.success("删除学校类型成功！");
				reload();
			}, function(){
				uihelper.fail("删除学校类型失败！");
			});
		}
	});
	
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
		$http.get('/system/school-type', {params: params}).then(function(resp){
			// 解析出分页需要的所有数据
			parsePages($scope, resp.data.page_info);
			$scope.records = getRecords($scope, resp.data.schooltypes);
		});
	}

	function watchReload(v) {
		ready && reload();
	}
}

SchoolTypeOrganizationController.$inject = ['$scope', '$http', 'parsePages', 'uihelper'];

module.exports = SchoolTypeOrganizationController;

function getRecords(scope, data) {
	// 格式化后台数据
	
	return data;
}
