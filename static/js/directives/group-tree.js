function groupTreeDirective() {
	return {
		restrict: 'EA',
		scope: {url: '='},
		replace: true,
		controller: 'GroupTreeController',
		template: 
		'<div class="tree smart-form">' +
		'  <ul role="tree">' +
		'    <tree-node ng-repeat="node in tree" data-node="node"></tree-node>' +
		'  </ul>' +
		'</div>',
		link: function(){
			// 监听节点点击事件
		}
	};
}

groupTreeDirective.$inject = [];

module.exports = groupTreeDirective;