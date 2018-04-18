function UserFormController($scope, $element, $http, uihelper) {
	var fields = ['id', 'username', 'password', 'full_name', 'password2', 'tel', 'email'];
	var $formCtrl;

	this.setValues = function(user) {
		angular.forEach(fields, function(f){
			$scope[f] = user[f];
		});
	};

	$scope.isValid = function(){
		if(!$formCtrl) {
			$formCtrl = $element.find('form').controller('form');
		}
		return $formCtrl.$valid;
	};

	$scope.submit = function(){
		var params = {}, url, method = 'post';
		if(!$scope.isValid()) { return; }
		$scope.loading = true;
		// 搜集数据
		angular.forEach(fields, function(f){
			params[f] = $scope[f];
		});
		if(params.id) {
			url = '/auth/' + params.id;
			method = 'put';
		} else {
			url = '/auth/register';
		}
		params.password1 = params.password;
		delete params.id;
		delete params.password;
		// 发送数据
		$http[method](url, params).then(function(resp){
			$element.data('result', true);
            if(method === 'put') {
    			$element.modal('hide');
            } else {
                uihelper.success('添加成功！');
                angular.forEach(fields, function(f){
                    $scope[f] = '';
                });
                $formCtrl.$setPristine();
            }
		}, function(error){
			$element.data('result', false);
			uihelper.fail('提交消息失败！');
		}).finally(function(){
			$scope.loading = false;
		});
	};
}


UserFormController.$inject = ['$scope', '$element', '$http', 'uihelper'];

module.exports = UserFormController;
