var selectable = require('../mixins/selectable');
var modalCRUD = require('../mixins/modal-crud');

function UserController($scope, $http, parsePages, uihelper) {
	var fields = ['page', 'limit', 'search'];
	var ready = true;

	$scope.page = 1;
	$scope.limit = 20;
	$scope.showPage = showPage;

	$scope.$watch('limit', watchReload);
	$scope.$watch('search', watchReload);

	selectable($scope);
	modalCRUD($scope, {
		entity: 'user',
		entityName: '用户',
		templateUrl: '/views/system/user-form.html',
		modify: {title: '修改用户'},
		'delete': {confirm: true},
		doDelete: function(records){
			$http.delete('/auth', {
				params: {ids: records.map(function(r){ return r.id; })}
			}).then(function(){
				uihelper.success("删除用户成功！");
				reload();
			}, function(){
				uihelper.fail("删除用户失败！");
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
		$http.get('/auth/list', {params: params}).then(function(resp){
			// 解析出分页需要的所有数据
			parsePages($scope, resp.data.page_info);
			$scope.records = getRecords($scope, resp.data.users);
		});
	}

	function watchReload(v) {
		ready && reload();
	}
}

UserController.$inject = ['$scope', '$http', 'parsePages', 'uihelper'];

module.exports = UserController;

function getRecords(scope, data) {
	// 格式化后台数据
	
	return data;
}
