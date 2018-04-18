function GlobalStatusController($scope, $http) {
	// var timer = setInterval(loadData, 1000);
	// $scope.$on('$destroy', function(){
	// 	timer && clearInterval(timer);
	// });
	var globalTimer;
	loadData();
	$scope.$on('$destroy', function(){
		clearTimeout(globalTimer);
	});
	function loadData() {
		$http.get('/dashboard/home').then(function(resp){
			var data = resp.data;
			if(typeof data === "string") {
				data = angular.fromJson(data);
			}
			angular.extend($scope, data.info);
		}).finally(function(){
			globalTimer = setTimeout(loadData, 1000 * 60 * 5)
		});
	}
	
}

GlobalStatusController.$inject = ['$scope', '$http'];

module.exports = GlobalStatusController