var fs = require('fs');
var http = require('http');

var Stockfetch = function() {
  this.getPriceForTickers = function(fileName, displayFn, errorFn) {
    this.reportCallback = displayFn;
    this.readTickersFile(fileName, errorFn);
  };

  this.readTickersFile = function(filename, onError) {
    var self = this;

    var processResponse = function(err, data) {
      if(err)
        onError('Error reading file: ' + filename);
      else {
        var tickers = self.parseTickers(data.toString());
        if(tickers.length === 0)
          onError('File ' + filename + ' has invalid content');
        else
          self.processTickers(tickers);
      }
    };

    fs.readFile(filename, processResponse);
  };

  this.parseTickers = function(content) {
    var isInRightFormat = function(str) {
      return str.trim().length !== 0 && str.indexOf(' ') < 0;
    };
    return content.split('\n').filter(isInRightFormat);
  };

  this.processTickers = function(tickers) {
    var self = this;
    self.tickersCount = tickers.length;

    tickers.forEach(function(ticker) {
      self.getPrice(ticker);
    });
  };

  this.tickersCount = 0;

  this.http = http;

  this.getPrice = function(symbol) {
    var url = 'http://ichart.finance.yahoo.com/table.csv?s=' + symbol;
    this.http.get(url, this.processResponse.bind(this, symbol))
      .on('error', this.processHttpError.bind(this, symbol));
  };

  this.processResponse = function(symbol, response) {
    var self = this;

    if (response.statusCode === 200) {
      var data = '';
      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        self.parsePrice(symbol, data);
      });
    } else {
      self.processError(symbol, response.statusCode);
    }
  };

  this.prices = {};

  this.parsePrice = function(ticker, data) {
    var price = data.split('\n')[1].split(',').pop();
    this.prices[ticker] = price;
    this.printReport();
  };

  this.errors = {};

  this.processError = function(ticker, error) {
    this.errors[ticker] = error;
    this.printReport();
  };

  this.reportCallback = function() {};

  this.printReport = function() {
    if (this.tickersCount === Object.keys(this.prices).length + Object.keys(this.errors).length) {
      this.reportCallback(this.sortData(this.prices), this.sortData(this.errors));
    };
  };

  this.sortData = function(dataToSort) {
    var toArray = function(key) { return [key, dataToSort[key]]; };
    return Object.keys(dataToSort).sort().map(toArray);
  };

  this.processHttpError = function(ticker, error) {
    this.processError(ticker, error.code);
  };
};

module.exports = Stockfetch;
