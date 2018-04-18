require('./init')();
require('../libs/angular-1.4.7/angular');
require('../libs/angular-1.4.7/angular-route');
// require('../libs/angular-1.4.7/angular-animate');

var app = angular.module("vdiMAS", ['ngRoute']);

// 主菜单
app.controller('MenuController', require('./controllers/menu'));
// app.controller('ChangePasswordController', require('./controllers/change-password'));
// 这个以后不需要了删掉
app.controller('ContainerController', require('./controllers/container'));
// 树形组件
app.controller('GroupTreeController', require('./controllers/group-tree'));
app.controller('TreeNodeController', require('./controllers/tree-node'));
// 当前概况
app.controller('GlobalStatusController', require('./controllers/globalstatus'));
app.controller('HostController', require('./controllers/host'));
app.controller('HostMonitorController', require('./controllers/host-monitor'));
app.controller('WarningLogController', require('./controllers/warning-log'));
// 用于【学校类型】，【学区】查询条件
app.controller('SchoolTypeController', require('./controllers/school-type'));
app.controller('SchoolAreaController', require('./controllers/school-area'));
// 统计的 controller 都在这里
app.controller(require('./controllers/statistics'));
// 远程维护
app.controller('RemoteMaintainController', require('./controllers/remote-maintain'));
// 系统管理 - 组织结构
app.controller('SchoolAreaOrganizationController', require('./controllers/organization-school-area'));
app.controller('SchoolTypeOrganizationController', require('./controllers/organization-school-type'));
app.controller('SchoolAreaFormController', require('./controllers/school-area-form'));
app.controller('SchoolTypeFormController', require('./controllers/school-type-form'));
// 系统管理 - 学校管理
app.controller('SchoolController', require('./controllers/school'));
app.controller('SchoolFormController', require('./controllers/school-form'));
// 系统管理 - 用户管理
app.controller('UserController', require('./controllers/user'));
app.controller('UserFormController', require('./controllers/user-form'));

// app.directive('appMenu', require('./directives/app-menu'));
// app.directive('changePassword', require('./directives/change-password'));
app.directive('datePicker', require('./directives/date-picker'));
app.directive('groupTree', require('./directives/group-tree'));
// app.directive('modalMonitor', require('./directives/modal-monitor'));
app.directive('schoolName', require('./directives/school-name'));
app.directive('schoolType', require('./directives/school-type'));
app.directive('pagesize', require('./directives/pagesize'));
app.directive('pageInfo', require('./directives/page-info'));
app.directive('pager', require('./directives/pager'));
// app.directive('timePicker', require('./directives/time-picker'));
app.directive('treeNode', require('./directives/tree-node'));
app.directive('areaIp', require('./directives/area-ip'));
app.directive('simplePie', require('./directives/simple-pie'));
app.directive('highchart', require('./directives/highchart'));
app.directive('timeRange', require('./directives/time-range'));
app.directive('schoolArea', require('./directives/school-area'));
app.directive('vNumber', require('./directives/v-number'));
app.directive('vIp', require('./directives/v-ip'));
app.directive('vPwdmatch', require('./directives/v-pwdmatch'));
app.directive('vObjectid', require('./directives/v-objectid'));

app.factory('MenuService', require('./services/menu'));
app.factory('parsePages', require('./services/parse-pages'));
app.factory('uihelper', require('./services/uihelper'));

app.run(initRun);
app.config(initConfig);

module.exports = app;


function initConfig($routeProvider, $compileProvider, $httpProvider) {
	// 禁用调试数据
	$compileProvider.debugInfoEnabled(false);
	// 点击左边的功能树时，以此为导航策略
	$routeProvider.when('/:menu', {
		templateUrl: getTempateUrl,
		controller: 'ContainerController'
	});
	$routeProvider.when('/:menu/:item', {
		templateUrl: getTempateUrl,
		controller: 'ContainerController'
	})
	.otherwise({
		redirectTo: '/general/status'
	});
	function getTempateUrl($routeParams) {
		var menu = $routeParams.menu;
		var item = $routeParams.item;
		var url = '/views/' + menu;
		if(item) {
			url += '/' + item + '.html';
		} else {
			url += '.html';
		}
		return url;
	}
	getTempateUrl.$inject = ['$routeParams'];
	$httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	$httpProvider.defaults.xsrfCookieName = "csrftoken";
	$httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
}

initConfig.$inject = ['$routeProvider', '$compileProvider', '$httpProvider'];

function initRun($rootScope, $http, MenuService, uihelper) {
	$http.get('/auth/username').then(function(resp){
		$rootScope.currentUser = resp.data;
	}, function(e){
		location.href = "/login";
	});
	$rootScope.$on('$routeChangeSuccess', function(e, current, prev){
		var html = MenuService.getBreadcrumbHtml(current.params);
		document.getElementById('ribbon').innerHTML = html;
	});
	$rootScope.logout = function(){
		$http.delete('/auth').then(function(){
			location.href = "/login";
		});
	};
	$rootScope.onViewLoad = function(){
		uihelper.onViewLoad();
	};
}

initRun.$inject = ['$rootScope', '$http', 'MenuService', 'uihelper'];
