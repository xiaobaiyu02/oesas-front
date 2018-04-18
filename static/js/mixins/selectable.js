module.exports = function(scope){
	scope.onSelectAllChange = onSelectAllChange;
	scope.onItemSelectChange = onItemSelectChange;
	scope.hasSelected = hasSelected;
	scope.getSelected = getSelected;
};


function onSelectAllChange(v){
	var records = this.records;
	angular.forEach(records, function(item){
		item.selected = v;
	});
}

function onItemSelectChange(s){
	var scope = this, same = true, v = s.selected;
	angular.forEach(scope.records, function(item){
		if(item.selected !== v) {
			same = false;
			return false;
		}
	});
	if(same) {
		scope.isSelectAll = v;
	} else {
		scope.isSelectAll = false;
	}
}

function hasSelected(){
	var arr = this.getSelected();
	return arr.length > 0;
}

function getSelected() {
	var arr = [];
	angular.forEach(this.records, function(item){
		item.selected && arr.push(item);
	});
	return arr;
}