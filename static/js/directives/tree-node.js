/**
 * 这个指令用来生成树节点，如果树节点有嵌套的节点，也将生成出来
 * 
 */
function treeNodeDirective($compile) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {node: '='},
		controller: 'TreeNodeController',
		template: '<li ng-class="{parent_li: node.children}" ng-style="{display: \'list-item\'}"><span class="label" ng-class="isSelected(node) ? \'selected_span\' : \'\'" ng-click="handleNodeClick($event, node)"><i ng-if="node.children" class="fa" ng-class="{\'fa-caret-down\': node.expand, \'fa-caret-right\': !node.expand}"></i> {{node.node_name}}</span></li>',
		link: function(scope, element, attrs){
			if(scope.node.children) {
				element.append('<ul role="group" ng-show="node.expand"><tree-node ng-repeat="sub in node.children" data-node="sub"></tree-node></ul>');
				$compile(element.contents())(scope)
			}
		}
	};
}

treeNodeDirective.$inject = ['$compile'];

module.exports = treeNodeDirective;