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
;angular.module('Bandpage')
    .controller('BandpageArticles', function BandpageArticles ($scope, articles, totalArticles) {
        var ctrl = this;
        ctrl.articles = articles;
        ctrl.predicate = '-sortTime';
        $scope.MainCtrl.totalArticles = totalArticles;
    });;angular.module('Bandpage')
    .controller('BandpageMain', function BandpageMain ($scope, $state, $document, $window, FeedService) {
        var ctrl = this;
        ctrl.feed = { url: 'http://blog.bandpage.com/', articles: false };
        ctrl.next =  0;
        ctrl.prev =  0;

        $document.on('scroll', function() {
            var nav = angular.element('#bandpage-nav');
            var scrollHeight = angular.element($window).scrollTop();
            nav.css({ backgroundPositionX: scrollHeight * 0.06 });
        });

        ctrl.requestFeed = function() {
            ctrl.feed.page = 1;
            ctrl.error = false;
            FeedService.resetService();
            FeedService.getFeed(ctrl.feed.url, 1).then(function() {
                ctrl.next =  1;
                ctrl.prev =  0;
                ctrl.page = 1;
                ctrl.feed.articles = true;
                ctrl.blogTitle = FeedService.blogTitle;
                ctrl.totalArticles = FeedService.totalArticles;
                $state.go('bandpage.articles', { intPage: 1, url: ctrl.feed.url } );
                $document.scrollTopAnimated(0);
            }, function(error){
                ctrl.feed.articles = false;
                ctrl.error = error.data.message;
            });
        };

        ctrl.calcPage = function(direction) {
            if (direction === 'next') {
                ctrl.next++;
                ctrl.prev++;
            } else {
                ctrl.next = Math.max(--ctrl.next, 1);
                ctrl.prev = Math.max(--ctrl.prev, 1);
            }

            ctrl.page = ctrl[direction] ? ctrl[direction] : 1;

            $state.go('bandpage.articles', { intPage: ctrl.page });
        };

        ctrl.requestFeed();

    });;angular.module('Bandpage')
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
;angular.module('Bandpage')
    .factory('FeedService', function FeedService ($http) {
        var extPage = 1, totalArticles = 0, blogTitle;

        function createURl(blogUrl, extPage) {
            var paged, encoded;
            paged = extPage > 1 ? '&paged=' + extPage : '';
            encoded = encodeURI(blogUrl + paged);
            return '/api/feed/?url=' + encoded;
        }

        function resetService() {
            this.extPage = 1;
            this.totalArticles = 0;
            this.blogTitle = '';
            this.pages = {};
            this.blogUrl = '';
        }

        function prettifyArticles(articles) {
            angular.forEach(articles, function(article) {
                article.sortTime = new Date(article.date).getTime();
                article.displayTime = moment(article.sortTime).fromNow();
            });

            return articles;
        }

        function getFeed(feed, intPage) {
            this.blogUrl = feed;
            this.parsedUrl = this.blogUrl;
            var url = createURl(this.parsedUrl, this.extPage);
            return $http.get(url).then(function(data) {
                var second = intPage++;
                var articles = prettifyArticles(data.data.articles);
                this.pages[intPage] = articles.slice(5, 10);
                this.pages[second] = articles.slice(0, 5);
                this.extPage++;
                this.blogTitle = data.data.title;
                this.totalArticles = Object.keys(this.pages).length;
                return this.pages;
            }.bind(this));
        }

        function getPage(intPage) {
            intPage = Math.max(intPage, 1);

            if (this.pages[intPage]) {
                return this.pages[intPage];
            } else {
                return this.getFeed(this.blogUrl, intPage).then( function() {
                    return this.pages[intPage];
                }.bind(this));
            }
        }

        return {
            getFeed: getFeed,
            getPage: getPage,
            resetService: resetService,
            pages: [],
            extPage: extPage,
            totalArticles: totalArticles,
            blogTitle: blogTitle
        };
    });;angular.module('Bandpage')
    .factory('moment', function ($window) {
        return $window.moment;
    });
