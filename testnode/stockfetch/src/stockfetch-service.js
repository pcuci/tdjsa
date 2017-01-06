var http = require('http');
var querystring = require('querystring');
var StockFetch = require('./stockfetch');

var handler = function(req, res) {
  var symbolString = querystring.parse(req.url.split('?')[1]).s || '';

  if(symbolString !== '') {
    var stockfetch = new StockFetch();
    var tickers = symbolString.split(',');

    stockfetch.reportCallback = function(prices, errors) {
      res.end(JSON.stringify({prices: prices, errors: errors}));
    };

    stockfetch.processTickers(tickers);
  }
  else {
    res.end('invalid query, use format ?=sSYM1,SYM2');
  }
};

http.createServer(handler).listen(3001);
