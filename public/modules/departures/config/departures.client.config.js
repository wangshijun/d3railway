'use strict';

// Configuring the Articles module
angular.module('departures').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '出发方向', 'departures', 'dropdown', '/departures(/create)?');
        Menus.addSubMenuItem('topbar', 'departures', '列表', 'departures');
        Menus.addSubMenuItem('topbar', 'departures', '添加', 'departures/create');
    }
]);
