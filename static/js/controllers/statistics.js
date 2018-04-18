/**
 * 这个文件包含 【教学桌面使用统计】和【个人桌面使用统计】功能所用到的 controller
 * 由于这些 controller 的代码和逻辑非常相似，所以使用一个文件减少额外重复的代码。
 */

var $http;
var parsePages;

var di = ['$scope'];

// 抽取公共服务，让下面的 controller 们减少依赖
(function(){
	var $doc = angular.element(document);
	$doc.ready(function(){
		$doc.injector().invoke(['$http', 'parsePages', function(a, b){
			$http = a;
			parsePages = b;
		}]);
	});
})();


module.exports = {
	// 教学桌面次数统计
	DesktopLogStatisticsByAreaController: DesktopLogStatisticsByAreaController,
	DesktopLogStatisticsBySchoolController: DesktopLogStatisticsBySchoolController,
	DesktopLogStatisticsBySchoolTypeController: DesktopLogStatisticsBySchoolTypeController,
	// 教学桌面时长统计
	DesktopTimeUsedByAreaController: DesktopTimeUsedByAreaController,
	DesktopTimeUsedBySchoolController: DesktopTimeUsedBySchoolController,
	DesktopTimeUsedBySchoolTypeController: DesktopTimeUsedBySchoolTypeController,
	// 个人桌面次数统计
	PersonalLogStatisticsByAreaController: PersonalLogStatisticsByAreaController,
	PersonalLogStatisticsBySchoolController: PersonalLogStatisticsBySchoolController,
	PersonalLogStatisticsBySchoolTypeController: PersonalLogStatisticsBySchoolTypeController,
	// 个人桌面时长统计
	PersonalTimeUsedByAreaController: PersonalTimeUsedByAreaController,
	PersonalTimeUsedBySchoolController: PersonalTimeUsedBySchoolController,
	PersonalTimeUsedBySchoolTypeController: PersonalTimeUsedBySchoolTypeController
};

angular.forEach(module.exports, function(fn){
	fn.$inject = di;
});

// 桌面次数统计 - 按学区统计
function DesktopLogStatisticsByAreaController($scope) {
	$scope.url = '/statistic/modes/loginnumber/area';
	$scope.fields = ['timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 桌面次数统计 - 按学校类型统计
function DesktopLogStatisticsBySchoolTypeController($scope) {
	$scope.url = '/statistic/modes/loginnumber/schooltype';
	$scope.fields = ['area', 'timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 桌面次数统计 - 按学校统计
function DesktopLogStatisticsBySchoolController($scope) {
	$scope.url = '/statistic/modes/loginnumber/school';
	$scope.fields = ['area', 'timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 桌面时长统计 - 按学区统计
function DesktopTimeUsedByAreaController($scope) {
	$scope.url = '/statistic/modes/runningtime/area';
	$scope.fields = ['timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 桌面时长统计 - 按学校类型统计
function DesktopTimeUsedBySchoolTypeController($scope) {
	$scope.url = '/statistic/modes/runningtime/schooltype';
	$scope.fields = ['area', 'timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 桌面时长统计 - 按学校统计
function DesktopTimeUsedBySchoolController($scope) {
	$scope.url = '/statistic/modes/runningtime/school';
	$scope.fields = ['area', 'timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 个人次数统计 - 按学区统计
function PersonalLogStatisticsByAreaController($scope) {
	$scope.url = '/statistic/instances/loginnumber/area';
	$scope.fields = ['timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 个人次数统计 - 按学校类型统计
function PersonalLogStatisticsBySchoolTypeController($scope) {
	$scope.url = '/statistic/instances/loginnumber/schooltype';
	$scope.fields = ['area', 'timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 个人次数统计 - 按学校统计
function PersonalLogStatisticsBySchoolController($scope) {
	$scope.url = '/statistic/instances/loginnumber/school';
	$scope.fields = ['area', 'timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 个人时长统计 - 按学区统计
function PersonalTimeUsedByAreaController($scope) {
	$scope.url = '/statistic/instances/runningtime/area';
	$scope.fields = ['timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 个人时长统计 - 按学校类型统计
function PersonalTimeUsedBySchoolTypeController($scope) {
	$scope.url = '/statistic/instances/runningtime/schooltype';
	$scope.fields = ['area', 'timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}

// 个人时长统计 - 按学校统计
function PersonalTimeUsedBySchoolController($scope) {
	$scope.url = '/statistic/instances/runningtime/school';
	$scope.fields = ['area', 'timebegin', 'timeend', 'page', 'limit'];
	$scope.dataRoot = 'results';
	initScope($scope);
	this.onTabActive = function(){
		$scope.reload();
	};
}


function getRecords(scope, data) {
	// 如果需要格式化后端发送过来的数据，在此修改
	return data;
}


function initScope(scope, options) {
	var defaults = {
		page: 1,
		limit: 10,
		// 显示第 p 页数据
		showPage: function(p){
			this.reload({page: p});
			this.page = p;
		},
		reload: reload,
		setTimeRange: setTimeRange,
		tryShowPicker: tryShowPicker
	};
	options = options || {};
	angular.extend(scope, defaults, options);
    setTimeRange.call(scope);
	var delayTimer;
	scope.$watch('limit', function(){
		if(delayTimer) { clearTimeout(delayTimer); }
		delayTimer = setTimeout(function(){
			scope.reload();
			delayTimer = null;
		}, 500);
	});
}

function setTimeRange(method){
	var $scope = this, now = new Date(), end;
	end = now.toISOString().substr(0, 10);
	if(method === 'week') {
		now.setDate(now.getDate() - 7);
	} else if(method === 'month') {
		now.setMonth(now.getMonth() - 1);
	} else if(method === '3month') {
		now.setMonth(now.getMonth() - 3);
	}
	$scope.timebegin = now.toISOString().substr(0, 10);
	$scope.timeend = end;
}

function tryShowPicker(name){
	var $scope = this, picker, m, v;
	picker = $scope[name + 'Picker'];
	m = $scope.method;
	if(m === 'week' || m === 'month' || m === '3month') {
		return;
	}
    v = picker.data('datepicker').getFormattedDate();
	if($scope[name] !== v) {
		picker.datepicker('setDate', new Date($scope[name]));
	}
	picker.datepicker('show');
}

function reload(options) {
	var scope = this, params = {};
	options = options || {};
	angular.forEach(scope.fields, function(f){
		params[f] = scope[f];
	});
	angular.extend(params, options);
	if(params.area) {
		params.area = params.area.node_name;
	}
    if(params.timeend < params.timebegin) { return; }
	$http.get(scope.url, {params: params}).then(function(resp){
		// 解析出分页需要的所有数据
		parsePages(scope, resp.data.page_info);
		scope.records = (scope.getRecords ? scope.getRecords : getRecords)(scope, resp.data[scope.dataRoot]);
	});
}
