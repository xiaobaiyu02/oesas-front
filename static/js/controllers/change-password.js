function ChangePasswordController($scope, $http, uihelper) {
	var re = /^[a-z0-9]{6,20}$/i;
	// models
	$scope.old_password = "";
	$scope.new_password = "";
	$scope.new_password_confirm = "";
	
	$scope.submit = function(){
		var valid = true, removeModal = false;
		valid = valid && re.test($scope.old_password);
		valid = valid && re.test($scope.new_password);
		valid = valid && re.test($scope.new_password_confirm);
		valid = valid && $scope.new_password === $scope.new_password_confirm;
		if(!valid) { return; }
		if($scope.loading === true) { return; }
		setLoading(true);
		$http.post('/user/changepwd', {
			new_password: $scope.new_password,
			old_password: $scope.old_password
		}).then(function(data){
			removeModal = true;
			uihelper.alert(data.data.msg);
		}, function(data){
			uihelper.showerror(data.data.msg);
		}).finally(function(){
			setLoading(false);
			removeModal && $scope.$broadcast('remove-modal');
		});
	};
	function setLoading(v) {
		$scope.$broadcast('modal-loading', v);
	}
}

ChangePasswordController.$inject = ['$scope', '$http', 'uihelper'];

module.exports = ChangePasswordController;