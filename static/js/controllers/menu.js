

function MenuController($scope, MenuService, $location) {

    var ready = false;

    $scope.menus = MenuService.getMenu();;
    
    $scope.isActive = function(menu, item){
        var url = '/' + menu;
        if(item) {
            url = url + '/' + item;
        }
        return url === $location.path();
    };

    $scope.defaultExpand = function(menu){
        var url = '/' + menu + '/';
        var path = $location.path();
        return path.indexOf(url) === 0;
    };

    $scope.defaultHref = function(data){
        var parts = ['#', data.key];
        if(data.single) {
            return parts.join('/');
        }
        return '#';
    };

    $scope.toggleExpand = function(e, m){
        var link = $(e.target), href;
        if(e.target.tagName.toLowerCase() !== 'a') {
            link = link.closest('a');
        }
        href = link.attr('href') || '#';
        if(href === '#') {
            e.preventDefault();
            e.stopPropagation();
        }
        if(m.expand) {
            m.expand = false;
            return;
        }
        angular.forEach($scope.menus, function(menu){
            if(m !== menu) {
                menu.expand = false;
            }
        });
        m.expand = true;
    };

    $scope.canGroupActive = function(m){
        var url = '/' + m.key, path = $location.path();
        // 当前分组功能被激活
        if(path.indexOf(url) === 0) {
            if(!ready) {
                m.expand = true;
                ready = true;
            }
            if(m.single) {
                return true;
            }
            if(!m.expand) {
                return true;
            }
        }
        return false;
    }

    // $scope.
}

MenuController.$inject = ['$scope', 'MenuService', '$location'];

module.exports = MenuController;
