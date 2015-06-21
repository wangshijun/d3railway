'use strict';

// Configuring the Articles module
angular.module('tracks').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '股道', 'tracks', 'dropdown', '/tracks(/create)?');
        Menus.addSubMenuItem('topbar', 'tracks', '列表', 'tracks');
        Menus.addSubMenuItem('topbar', 'tracks', '添加', 'tracks/create');
    }
]);
