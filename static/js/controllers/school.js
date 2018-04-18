var selectable = require('../mixins/selectable');
var modalCRUD = require('../mixins/modal-crud');

function SchoolController($scope, $http, parsePages, uihelper) {
	var fields = ['page', 'limit', 'search'];
	var ready = true;

	$scope.page = 1;
	$scope.limit = 20;
	$scope.showPage = showPage;

	$scope.$watch('limit', watchReload);
	$scope.$watch('search', watchReload);

	selectable($scope);
	modalCRUD($scope, {
		entity: 'school',
		entityName: '学校',
		templateUrl: '/views/system/school-form.html',
		modify: {title: '修改学校'},
		'delete': {confirm: true},
		doDelete: function(records){
			$http.delete('/system/nodes', {
				params: {obj_id: records.map(function(r){ return r.id; })}
			}).then(function(){
				uihelper.success("删除学校成功！");
				reload();
			}, function(){
				uihelper.fail("删除学校失败！");
			});
		}
	});

	$scope.testConnection = function(item, alert){
		item.connecting = true;
		$http.get('/system/school/ping', {
			params: {id: item.id}
		}).then(function(resp){
			item.status = resp.data.result ? '连接成功' : '连接失败';
			if(alert !== false) {
				uihelper[resp.data.result ? 'success' : 'fail'](resp.data.msg);
			}
		}).finally(function(){
			item.connecting = false;
		});
	};

	function showPage(p) {
		reload({page: p});
		$scope.page = p;
	}

	function reload(options) {
		var params = {node_type: 'school'};
		options = options || {};
		angular.forEach(fields, function(f){
			params[f] = $scope[f];
		});
		angular.extend(params, options);
		$http.get('/system/nodes', {params: params}).then(function(resp){
			// 解析出分页需要的所有数据
			parsePages($scope, resp.data.page_info);
			$scope.records = getRecords($scope, resp.data.nodes);
			angular.forEach($scope.records, function(item){
				$scope.testConnection(item, false);
			});
		});
	}

	function watchReload(v) {
		ready && reload();
	}
}

SchoolController.$inject = ['$scope', '$http', 'parsePages', 'uihelper'];

module.exports = SchoolController;

function getRecords(scope, data) {
	// 格式化后台数据
	
	return data;
}
