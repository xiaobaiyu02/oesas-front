function SchoolFormController($scope, $http, $element, uihelper) {
	var fields = ['id', 'managers', 'node_name', 'controller_ip', 'parent', 'school_type', 'username', 'password'/*'code'*/];
	var $formCtrl;
	this.setValues = function(data) {
		angular.forEach(fields, function(f){
			$scope[f] = data[f];
		});
	};

	$scope.isValid = function(){
		if(!$formCtrl) {
			$formCtrl = $element.find('form').controller('form');
		}
		return $formCtrl.$valid;
	};

	$scope.submit = function(){
		var params = {}, url = '/system/nodes', method = 'post';
		if(!$scope.isValid()) { return; }
		// 搜集数据
		angular.forEach(fields, function(f){
			params[f] = $scope[f];
		});
		params.parent = params.parent.id;
		params.school_type = params.school_type.id;
        if(!params.parent || !params.school_type) { return; }
		if(params.id) {
			url += '/' + params.id;
			method = 'put';
		}
		delete params.id;
		$scope.loading = true;
		// 先验证
		$http.get('/system/school/ping_test', {params: {
			ip: params.controller_ip,
			username: params.username,
			password: params.password
		}}).then(function(resp){
			if(!resp.data.result) {
				uihelper.fail(resp.data.msg);
				$scope.loading = false;
			} else {
				$http[method](url, {node: params}).then(function(resp){
					$element.data('result', true);
					$element.modal('hide');
				}, function(error){
					$element.data('result', false);
					uihelper.fail('提交消息失败！');
				}).finally(function(){
					$scope.loading = false;
				});
			}
		});
	};

	$scope.testConnection = function(){
		this.testResult = "测试连接成功！";
		setTimeout(function(){
			this.$apply('testResult = ""');
		}.bind(this), 3000);
	};

	// 学区
	$http.get('/system/nodes', {params: {node_type: 'area'}}).then(function(resp){
        var def = {node_name: '请选择'};
        var areas = resp.data.nodes;
        areas.unshift(def);
        if(!$scope.parent) {
            $scope.parent = def;
        } else {
            angular.forEach(areas, function(a){
                if(a.id === $scope.parent.id) {
                    $scope.parent = a;
                }
            });
        }
		$scope.areas = areas;
	});
	// 学校类型
	$http.get('/system/school-type').then(function(resp){
        var def = {name: '请选择'};
        var types = resp.data.schooltypes;
        types.unshift(def);
        if(!$scope.school_type) {
            $scope.school_type = def;
        } else {
            angular.forEach(types, function(t){
                if(t.id === $scope.school_type.id) {
                    $scope.school_type = t;
                }
            });
        }
		$scope.types = types;
	});
}


SchoolFormController.$inject = ['$scope', '$http', '$element', 'uihelper'];

module.exports = SchoolFormController;
