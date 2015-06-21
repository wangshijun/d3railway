'use strict';

// Configuring the Articles module
angular.module('arrivals').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '到达方向', 'arrivals', 'dropdown', '/arrivals(/create)?');
        Menus.addSubMenuItem('topbar', 'arrivals', '列表', 'arrivals');
        Menus.addSubMenuItem('topbar', 'arrivals', '添加', 'arrivals/create');
    }
]);
