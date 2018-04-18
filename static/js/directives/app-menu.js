function AppMenuDirective() {
	return {
		restrict: 'A',
		scope: true,
		controller: 'MenuController',
		link: function(scope, element, attrs){
			element.delegate('a', 'click', onItemClick);
		}
	};
}

AppMenuDirective.$inject = [];

module.exports = AppMenuDirective;

function onItemClick(e) {
	var me = $(this), $ul;
	// 菜单组，这种也可以识别没有子菜单的情况
	if(me.children('.menu-item-parent').length === 0) { return; }
	e.stopPropagation();
	$ul = me.siblings('ul')
	me.closest('li').siblings('.open').removeClass('open').children('ul').slideUp(200);
	$ul.slideDown(200);
	me.closest('li').addClass('open');
}