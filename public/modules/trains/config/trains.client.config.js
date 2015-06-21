'use strict';

// Configuring the Articles module
angular.module('trains').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '列车', 'trains', 'dropdown', '/trains(/create)?');
        Menus.addSubMenuItem('topbar', 'trains', '列表', 'trains');
        Menus.addSubMenuItem('topbar', 'trains', '添加', 'trains/create');
    }
]);
