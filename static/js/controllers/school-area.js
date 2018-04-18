function schoolAreaDirective($scope, $http) {
	$http.get('/system/nodes', {params: {type: 'area'}}).then(function(resp){
		$scope.areas = resp.data.nodes;
	});
}

schoolAreaDirective.$inject = ['$scope', '$http'];

module.exports = schoolAreaDirective;