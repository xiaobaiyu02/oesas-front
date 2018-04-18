function modalMonitor(uihelper){
	var caches = {};
	return {
		restrict: 'EA',
		scope: {loading: '@'},
		controller: function($scope){
			var id = $scope.$id;
			$scope.$on('modal-loading', function(e, v){
				var element = caches[id], modal = element.closest('.modal');
				uihelper[v ? 'showLoading' : 'hideLoading'](modal);
			});
			$scope.$on('remove-modal', function(){
				var element = caches[id], modal = element.closest('.modal');
				modal.modal('hide');
				modal.on('hidden.bs.modal', function(){
					modal.remove();
				});
			});
			$scope.$on('$destroy', function(){
				delete caches[id];
			});
		},
		link: function(scope, element){
			caches[scope.$id] = element;
		}
	};
}


modalMonitor.$inject = [];

module.exports = modalMonitor;