var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var FeedParser = require('feedparser');
var helpers = require('../helpers');
var RequestError = 'This is not a valid RSS feed.';
var FeedError = 'This is not a valid RSS feed.';

/* GET feed listing. */
router.get('/feed', function(req, res) {
    var articles = [], feedMeta;

    /* parse url from request */
    var parsedUrl = helpers.parseFeedURl(req.query.url);

    /* add page if available */
    if (req.query.paged) {
        parsedUrl += '?paged=' + req.query.paged;
        console.log(parsedUrl);
    }

    /*  pipe rss response into feedparser, build an array of articles, and respond with error if the feed is invalid */
    var request = http.get(parsedUrl, function(response) {
        response.pipe(new FeedParser())
            .on('error', function(){
                res.status(400);
                res.send({ success: false, message: FeedError });
            })
            .on('meta', function(meta){
                feedMeta = meta;
            })
            .on('readable', function(){
                var stream = this, item;
                while (article = stream.read()){
                    articles.push(article);
                }
            })
            .on('end', function(stuff){
                if (articles.length) {
                    res.send({success: true, articles: articles, title: feedMeta.title });
                }
            });

    });

    request.on('error', function(e) {
        res.status(400);
        res.send({ success: false, message: RequestError });
    });
});

module.exports = router;
