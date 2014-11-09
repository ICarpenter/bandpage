angular.module('Bandpage')
    .controller('BandpageArticles', function BandpageArticles ($scope, articles, totalArticles) {
        var ctrl = this;
        ctrl.articles = articles;
        ctrl.predicate = '-sortTime';
        $scope.MainCtrl.totalArticles = totalArticles;
    });