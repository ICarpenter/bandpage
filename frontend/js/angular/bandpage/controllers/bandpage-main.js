angular.module('Bandpage')
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

    });