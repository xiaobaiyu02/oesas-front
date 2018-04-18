function pageInfoDirective() {
	return {
		restrict: 'EA',
		replace: true,
		template: '<p class="page-info">显示 <span ng-bind="from_record"></span> 到 <span ng-bind="to_record"></span>，共 <span ng-bind="count"></span> 项</p>'
	};
}

pageInfoDirective.$inject = [];

module.exports = pageInfoDirective;