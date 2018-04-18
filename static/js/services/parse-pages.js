function parsePages(scope, pageInfo) {
	var old_limit = scope.limit;
	angular.extend(scope, pageInfo);
	scope.limit = old_limit;
	scope.from_record = scope.limit * (scope.page - 1) + 1;
	scope.to_record = scope.from_record + scope.limit - 1;
	scope.pages = getClosestPages(scope.page, scope.num_pages);
}

function getClosestPages(current, total) {
	var pages = [], p = current, c = 2;
	// 从当前分页向前的最多两页
	while(p > 1 && c-- > 0) {
		pages.unshift(--p);
	}
	// 加上当前页
	pages.push(current);
	p = current;
	// 添加向后的分页
	while(++p <= total && pages.length < 5) {
		pages.push(p);
	}
	return pages;
}

module.exports = function(){
	return parsePages;
};