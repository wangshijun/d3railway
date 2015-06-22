'use strict';

angular.module('core').filter('slicetime', function () {
    return function (input) {
        if (input) {
            var date = new Date(input);
            return moment(date).tz('Asia/Shanghai').format('HH:mm');
        } else {
            return '';
        }
    };
});

