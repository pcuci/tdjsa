var http = require('http');
var querystring = require('querystring');
var StockFetch = require('./stockfetch');

var handler = function(req, res) {
  var symbolString = querystring.parse(req.url.split('?')[1]).s || '';

  if (symbolString !== '') {
    var stockfetch = new StockFetch();
    var tickers = symbolString.split(',');

    stockfetch.reportCallback = function(prices, errors) {
      res.end(JSON.stringify({prices: prices, errors: errors}));
    };

    stockfetch.processTickers(tickers);
  } else {
    res.end('invalid query, use format ?s=SYM1,SYM2');
  }
};

http.createServer(handler).listen(3001);

/* TODO To write automated tests you’d have to design the code in stockfetch-service.js file differently. First, move the handler function to a separate file so it can be isolated and tested. The tests would verify that the function is handling various query strings, like an empty query string or one with no symbols, and so on. To test these we’d stub out req and res. Then the tests can verify that the function is interacting correctly with Stockfetch—we’d have to pass Stockfetch as a parameter for easy stubbing. Finally, we can test that the service file registers the handler function properly with the http.createServer function. That would test this piece of code, but in reality a typical web app would use different HTTP methods, like GET, POST, and DELETE, and multiple routes, like /, /stocks, and so on.
*/
