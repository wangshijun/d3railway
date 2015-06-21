'use strict';

// Configuring the Articles module
angular.module('departures').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Departures', 'departures', 'dropdown', '/departures(/create)?');
        Menus.addSubMenuItem('topbar', 'departures', 'List Departures', 'departures');
        Menus.addSubMenuItem('topbar', 'departures', 'New Departure', 'departures/create');
    }
]);
