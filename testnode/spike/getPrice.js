var http = require('http');

var getPriceTrial = function(ticker) {
  http.get('http://ichart.finance.yahoo.com/table.csv?s=' + ticker,
    function(response) {
      if (response.statusCode === 200) {
        var data = '';
        var getChunk = function(chunk) {
          data += chunk;
        };
        response.on('data', getChunk);
        response.on('end', function() {
          console.log('received data for ' + ticker);
          console.log(data);
        });
      }
      else {
        console.error(ticker + ' - error getting data : ' + response.statusCode);
      };
    }
  ).on('error', function(err) {
    console.error(ticker + ' - error getting data : ' + err.code);
  });
};

getPriceTrial('GOOG');
getPriceTrial('INVALID');
