function changePasswordDirective(uihelper) {
	return {
		restrict: 'A',
		link: function(scope, element){
			element.on('click', function(){
				uihelper.openModal({
					controller: 'ChangePasswordController',
					url: '/views/changepwd.html'
				});
			});
		}
	};
}

changePasswordDirective.$inject = ['uihelper'];

module.exports = changePasswordDirective;