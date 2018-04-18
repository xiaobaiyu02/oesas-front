function schoolNameDirective() {
	return {
		restrict: 'EA',
		replace: true,
		template: '<label class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span> ' +
		'<input type="text" ng-model="search" class="form-control" placeholder="搜索"></label>'
	};
}

schoolNameDirective.$inject = [];

module.exports = schoolNameDirective;
