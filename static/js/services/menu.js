module.exports = menuService;

var menus = [{
    text: '当前概况',
    key: 'general',
    expand: false,
    iconClass: 'icon-jj-home',
    children: [{
        text: '当前状态',
        iconClass: 'fa-code',
        key: 'status'
    }, {
        text: '主机概况',
        iconClass: 'fa-code',
        key: 'host'
    }, {
        text: '主机监控',
        iconClass: 'fa-code',
        key: 'monitor'
    }, {
        text: '告警信息',
        iconClass: 'fa-code',
        key: 'warnlog'
    }]
}, {
    text: '教学桌面使用统计',
    key: 'desktop-statistics',
    iconClass: 'icon-jj-cloud',
    expand: false,
    children: [{
        text: '教学桌面登录次数',
        iconClass: 'fa-code',
        key: 'logged-in'
    }, {
        text: '教学桌面登录时长',
        iconClass: 'fa-code',
        key: 'time-used'
    }]
}, {
    text: '个人桌面使用统计',
    key: 'personal-statistics',
    iconClass: 'icon-jj-pc',
    expand: false,
    children: [{
        text: '个人桌面登录次数',
        iconClass: 'fa-code',
        key: 'logged-in'
    }, {
        text: '个人桌面使用时长',
        iconClass: 'fa-code',
        key: 'time-used'
    }]
}, {
    text: '远程维护',
    iconClass: 'icon-jj-Template',
    key: 'remote-maintain',
    single: true
}, {
    text: '系统管理',
    key: 'system',
    iconClass: 'icon-jj-Terminal',
    expand: false,
    children: [{
        text: '组织结构',
        iconClass: 'fa-code',
        key: 'org'
    }, {
        text: '学校管理',
        iconClass: 'fa-code',
        key: 'school'
    }, {
        text: '用户管理',
        iconClass: 'fa-code',
        key: 'user'
    }]
}];

function menuService($routeParams) {
    return {
        getMenu: function(){
            return menus;
        },
        getBreadcrumbHtml: function(params){
            var parts = [];
            params = params || $routeParams;
            menus.forEach(function(m){
                if(m.key === params.menu) {
                    parts.push(m.text);
                    if(m.children) {
                        m.children.forEach(function(c){
                            if(c.key === params.item) {
                                parts.push(c.text);
                                return false;
                            }
                        });
                    }
                    return false;
                }
            });
            return '<ol class="breadcrumb"><li>' + parts.join('</li><li>') + '</li></ol>';
        },
        getMenuIndexes: function(){
            var obj = {menu: 0, item: 0}, params = $routeParams;
            // 没有触发 $routeChangeSuccess 的时候，$routeParams 是个空对象
            if(typeof params.menu !== "number") {
                obj.ready = false;
                return obj;
            }
            menus.forEach(function(m, i){
                if(m.key === params.menu) {
                    obj.menu = i;
                    if(m.children) {
                        m.children.forEach(function(c, j){
                            if(c.key === params.item) {
                                obj.item = j;
                                return false;
                            }
                        });
                    } else {
                        obj.item = -1;
                    }
                    return false;
                }
            });
            return obj;
        }
    };
}

menuService.$inject = ['$routeParams'];