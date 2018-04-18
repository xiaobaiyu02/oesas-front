function SchoolTypeFormController($scope, $http, $element, uihelper) {
	var fields = ['id', 'name', 'desc'];
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
		var params = {}, url = '/system/school-type', method = 'post';
		if(!$scope.isValid()) { return; }
		$scope.loading = true;
		// 搜集数据
		angular.forEach(fields, function(f){
			params[f] = $scope[f];
		});
		if(params.id) {
			url += '/' + params.id;
			method = 'put';
		}
		delete params.id;
		// 发送数据
		$http[method](url, {schooltype: params}).then(function(resp){
			$element.data('result', true);
			$element.modal('hide');
		}, function(error){
			$element.data('result', false);
			uihelper.fail('提交消息失败！');
		}).finally(function(){
			$scope.loading = false;
		});
	};
}


SchoolTypeFormController.$inject = ['$scope', '$http', '$element', 'uihelper'];

module.exports = SchoolTypeFormController;