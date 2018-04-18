function pagesizeDirective() {
	return {
		restrict: 'EA',
		replace: true,
		template: '<div class="form-group"><label>显示</label> ' +
			'<select class="form-control" ng-model="limit" ng-options="n for n in [10, 30, 60, 100]"></select>' +
			' <label>项结果</label></div>',
		link: function(scope) {
			// 强制默认为 30
			scope.limit = 30;
		}
	};
}

pagesizeDirective.$inject = [];

module.exports = pagesizeDirective;