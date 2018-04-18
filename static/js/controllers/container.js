// 这个 Controller 为下面的 view 准备一些公用的环境
// 具体的以后再补充
function ContainerController($scope) {
	$scope.role = "viewcontainer";
	// 当子 scope 需要通知另一些 scope 一些事情的时候，调用此方法
	$scope.fireViewEvent = function(name, args){
		$scope.$broadcast(name, args);
	};
}

ContainerController.$inject = ['$scope'];

module.exports = ContainerController