'use strict';

angular.module('core').filter('slicetime', function () {
    return function (input) {
        var date = new Date(input);
        return moment(date).tz('Asia/Shanghai').format('HH:mm');
    };
});

