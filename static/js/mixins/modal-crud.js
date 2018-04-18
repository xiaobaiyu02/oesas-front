var uihelper;

module.exports = function(scope, options){
	var entity = options.entity, suffix;
	inject();
	suffix = entity.charAt(0).toUpperCase() + entity.substring(1);
	// 添加操作
	scope['add' + suffix] = function(){
		var addOptions = options.add || {};
		uihelper.openModal(addOptions.templateUrl || options.templateUrl, {
			backdrop: 'static',
			keyboard: false
		}).then(function($el) {
			if(addOptions.title) {
				$el.find('.modal-title').text(addOptions.title);
			}
			uihelper.setupForm($el.find('form'));
			$el.on('hide.bs.modal', function(e){
				$(this).data('result') && reload();
			});
		});
	};
	// 编辑操作
	scope['modify' + suffix] = function(record){
		var modifyOptions = options.modify || {};
		uihelper.openModal(modifyOptions.templateUrl || options.templateUrl, {
			backdrop: 'static',
			keyboard: false
		}).then(function($el) {
			if(modifyOptions.title) {
				$el.find('.modal-title').text(modifyOptions.title);
			}
			uihelper.setupForm($el.find('form'), {values: record});
			$el.on('hide.bs.modal', function(e){
				$(this).data('result') && reload();
			});
		});
	};
	// 删除操作
	scope['delete' + suffix] = function(){
		var records = this.getSelected(), deleteOptions = options['delete'] || {};
		if(records.length === 0) { return; }
		var callback = options.doDelete || function(){};
		if(deleteOptions.confirm) {
			uihelper.modal_confirm({
				content: '确定要删除选中的' + options.entityName + '吗？',
				callback: function(b){
					b && callback.call(scope, records);
				}
			});
		} else {
			callback.call(scope, records);
		}
	};
	// 清理资源
	scope.$on('$destroy', function(){
		scope['add' + suffix] = null;
		scope['modify' + suffix] = null;
		scope['delete' + suffix] = null;
		options = null;
	});

	function reload() {
		scope.showPage(scope.page);
	}
};

function inject() {
	if(inject.called) { return; }
	angular.element(document).injector().invoke(['uihelper', function(a){
		uihelper = a;
	}]);
	inject.called = true;
}