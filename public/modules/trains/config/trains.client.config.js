'use strict';

// Configuring the Articles module
angular.module('trains').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Trains', 'trains', 'dropdown', '/trains(/create)?');
        Menus.addSubMenuItem('topbar', 'trains', 'List Trains', 'trains');
        Menus.addSubMenuItem('topbar', 'trains', 'New Train', 'trains/create');
    }
]);
