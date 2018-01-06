module.exports.getDataInshorts =  function(context) {
    return new Promise(function(resolve, reject) {
        var request = require('request');
        var htmlparser = require('htmlparser2');
        var newsItem = require('./news');
        var newsItems = [];
        var bodyPending = false;
        var headlinePending = false;
        var latestNewsItem = null;
        request('https://www.inshorts.com/en/read', function (error, response, body) {
            console.log(body);
            var parser = new htmlparser.Parser({
                onopentag: function(name, attribs){
                    if(name === "span" && attribs.itemprop === "datePublished"){
                        latestNewsItem.timestamp = attribs.content;
                    } else if(name === "div" && attribs.itemprop === "articleBody"){
                        bodyPending = true;
                    } else if(name === "span" && attribs.itemprop === "headline") {
                        headlinePending = true;
                    }
                },
                ontext: function(text){
                    if(bodyPending == true && latestNewsItem != null) {
                        latestNewsItem.text = text;
                        newsItems.push(latestNewsItem);
                        bodyPending = false;
                    } else if(headlinePending == true) {
                        latestNewsItem = new newsItem.News(text, null, null);
                        headlinePending = false;
                    }
                },
                onend: function() {
                    context.log(newsItems);
                    resolve(newsItems);
                }
            }, {decodeEntities: true});
            parser.write(body);
            parser.end();
        });
    });
}