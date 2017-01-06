var Stockfetch = require('./stockfetch');

var display = function(prices, errors) {
  var print = function(data) {
    console.log(data[0] + '\t' + data[1]);
  };

  console.log("Prices for ticker symbols:");
  prices.forEach(print);

  console.log("Ticker symbols with errors:");
  errors.forEach(print);
};

var onError = function(error) {
  console.error(error);
};

new Stockfetch().getPriceForTickers('mixedTickers.txt', display, onError);
