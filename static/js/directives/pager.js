function pagerDirective() {
	return {
		restrict: 'EA',
		replace: true,
		template: 
		'<ul class="pagination pagination-xs">' +
			'<li ng-class="page === 1 && \'disabled\'"><a href="javascript:void(0);" ng-click="page !== 1&&showPage(1)">&laquo;</a></li>' +
			'<li ng-class="page < 2 && \'disabled\'"><a href="javascript:void(0);" ng-click="page>1&&showPage(page-1)">‹</a></li>' +
			'<li ng-repeat="x in pages" ng-class="{active: x === page}"><a href="javascript:void(0);" ng-click="x!==page && showPage(x)" ng-bind="x"></a></li>' +
			'<li ng-class="page >= num_pages && \'disabled\'"><a href="javascript:void(0);" ng-click="page < num_pages&&showPage(page+1)">›</a></li>' +
			'<li ng-class="page === num_pages && \'disabled\'"><a href="javascript:void(0);" ng-click="page !== num_pages&&showPage(num_pages)">&raquo;</a></li>' +
		'</ul>'
	};
}

pagerDirective.$inject = [];

module.exports = pagerDirective;
