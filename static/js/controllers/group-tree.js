function GroupTreeController($scope, $http) {
	var currentNode;
	$scope.getCurrentNode = function(){
		return currentNode;
	};

	$scope.setCurrentNode = function(node){
		if(node === currentNode) { return; }
		currentNode = node;
		fireNodeChange(node);
	};

	$http.get($scope.url || '/system/nodes/tree').then(function(resp){
		$scope.tree = enhance(resp.data.tree);
		currentNode = resp.data.tree[0];
		fireNodeChange(resp.data.tree[0]);
	});
	// 当选择的节点发生变化后调用此函数
	function fireNodeChange(node) {
		var p = $scope.$parent;
		while(p) {
			if(p.role === "viewcontainer") {
				break;
			} else {
				p = p.$parent;
			}
		}
		p.fireViewEvent('node:change', node);
	}
}

GroupTreeController.$inject = ['$scope', '$http'];

module.exports = GroupTreeController;

function enhance(arr) {
	var i = 0, len = arr.length;
	for(;i<len;i++) {
		node = arr[i];
		if(node.children) {
			node.expand = true;
			enhance(node.children);
		}
	}
	return arr;
}