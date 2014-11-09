angular.module('Bandpage')
    .factory('moment', function ($window) {
        return $window.moment;
    });
