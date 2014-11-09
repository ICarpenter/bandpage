angular.module('Bandpage')
    .config(function($urlRouterProvider, $stateProvider, $uiViewScrollProvider) {
        $urlRouterProvider.otherwise('/');
        $uiViewScrollProvider.useAnchorScroll();
        $stateProvider
            .state('bandpage', {
                url: '/',
                views: {
                    'bandpage-main': {
                        templateUrl: 'bandpage/partials/page.html',
                        controller: 'BandpageMain as MainCtrl'
                    }
                }
            })
            .state('bandpage.articles', {
                params: { intPage: {}, url: {} },
                views: {
                    'bandpage-content': {
                        templateUrl: 'bandpage/partials/articles.html',
                        controller: 'BandpageArticles as ArticleCtrl'
                    }
                },
                resolve: {
                    articles: function($stateParams, FeedService) {
                        return FeedService.getPage($stateParams.intPage);
                    },
                    totalArticles: function(articles, FeedService) {
                        return FeedService.totalArticles;
                    }
                }
            });
    });
