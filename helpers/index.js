var url = require('url');
var _ = require('lodash');


/* parse the url for input consistancy */
function parseFeedURl(feedUrl) {
    var parsed, parsedUrl, path;
    parsed = url.parse(feedUrl);
    parsedUrl = parsed.protocol ? parsed.protocol + '//' : 'http://';

    /* use hostname is available */
    if (parsed.hostname) {
        parsedUrl += parsed.hostname + '/' + removeFeedPath(parsed.path);
    } else {
        parsedUrl += removeFeedPath(parsed.path);
    }

    parsedUrl += 'feed/';
    return parsedUrl;
}

/* remove 'feed' from url if user entered it */
function removeFeedPath(path) {
    var url = '';
    if (path === '/') {
        return '';
    }

    path = path.split('/');

    _.forEach(path, function(part) {
        if(part !== 'feed' && part !== '') {
            url += part + '/';
        }
    });

    return url;
}

exports.parseFeedURl = parseFeedURl;