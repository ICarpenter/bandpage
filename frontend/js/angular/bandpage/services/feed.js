angular.module('Bandpage')
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
    });