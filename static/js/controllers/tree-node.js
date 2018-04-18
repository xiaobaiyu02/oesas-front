
function TreeNodeController($scope) {
	$scope.isSelected = function(node){
		return node === getCurrentNode();
	};
	// 节点点击事件处理函数
	$scope.handleNodeClick = function(e, node){
		// 先处理 caret
		var isCaret = e.target.className.indexOf('fa-caret') > -1;
		if(isCaret) {
			node.expand = !node.expand;
			e.preventDefault();
			e.stopImmediatePropagation();
			return;
		}
		setCurrentNode(node);
	};

	function getCurrentNode() {
		var p = $scope.$parent;
		while(p) {
			if(typeof p.getCurrentNode === "function") {
				break;
			} else {
				p = p.$parent;
			}
		}
		return p.getCurrentNode();
	}

	function setCurrentNode(node) {
		var p = $scope.$parent;
		while(p) {
			if(typeof p.setCurrentNode === "function") {
				break;
			} else {
				p = p.$parent;
			}
		}
		return p.setCurrentNode(node);
	}
}

TreeNodeController.$inject = ['$scope'];

module.exports = TreeNodeController;