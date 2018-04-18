function SchoolTypeController($scope, $http) {
	$http.get('/system/school-type').then(function(resp){
		// 解析出分页需要的所有数据
		$scope.types = resp.data.schooltypes;
	});
}

SchoolTypeController.$inject = ['$scope', '$http'];

module.exports = SchoolTypeController;