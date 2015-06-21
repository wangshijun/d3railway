'use strict';

// Configuring the Articles module
angular.module('arrivals').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Arrivals', 'arrivals', 'dropdown', '/arrivals(/create)?');
        Menus.addSubMenuItem('topbar', 'arrivals', 'List Arrivals', 'arrivals');
        Menus.addSubMenuItem('topbar', 'arrivals', 'New Arrival', 'arrivals/create');
    }
]);
