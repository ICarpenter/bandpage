angular.module('Bandpage', [
        'Bandpage.templates',
        'ui.router',
        'ui.bootstrap',
        'ngSanitize',
        'ngAnimate',
        'duScroll'
    ]).config(function ($locationProvider, $anchorScrollProvider) {
        $locationProvider.html5Mode(true);
        $anchorScrollProvider.disableAutoScrolling(false);
    });
