var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');
var Stockfetch = require('../src/stockfetch');

describe('Stockfetch tests', function() {
  var stockfetch;
  var sandbox;

  beforeEach(function() {
    stockfetch = new Stockfetch();
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('canary test', function() {
    expect(true).to.be.true;
  });

  it('invokes error handler for invalid file', function(done) {
    var onError = function(err) {
      expect(err).to.be.eql('Error reading file: InvalidFile');
      done();
    };

    sandbox.stub(fs, 'readFile', function(fileName, callback) {
      callback(new Error('failed'));
    });

    stockfetch.readTickersFile('InvalidFile', onError);
  });

  it('invokes processTickers for valid file', function(done) {
    var rawData = 'GOOG\nAAPL\nORCL\nMSFT';
    var parsedData = ['GOOG', 'AAPL', 'ORCL', 'MSFT'];

    sandbox.stub(stockfetch, 'parseTickers')
      .withArgs(rawData).returns(parsedData);

    sandbox.stub(stockfetch, 'processTickers', function(data) {
      expect(data).to.be.eql(parsedData);
      done();
    });

    sandbox.stub(fs, 'readFile', function(fileName, callback) {
      callback(null, rawData);
    });

    stockfetch.readTickersFile('mixedTickers.txt');
  });

  it('error on reading empty file', function(done) {
    var onError = function(err) {
      expect(err).to.be.eql('File tickers.txt has invalid content');
      done();
    };

    sandbox.stub(stockfetch, 'parseTickers').withArgs('').returns([]);

    sandbox.stub(fs, 'readFile', function(fileName, callback) {
      callback(null, '');
    });

    stockfetch.readTickersFile('tickers.txt', onError);
  });

  it('parseTickers return valid tickers for valid file data', function() {
    expect(stockfetch.parseTickers("A\nB\nC")).to.be.eql(['A', 'B', 'C']);
  });

  it('parseTickers returns empty array for empty content', function() {
    expect(stockfetch.parseTickers("")).to.be.eql([]);
  });

  it('parseTickers returns empty array for white-space', function() {
    expect(stockfetch.parseTickers(" ")).to.be.eql([]);
  });

  it('parseTickers ignores unexpected format in content', function() {
    var rawData = "AAPL \nBla h\nGOOG\n\n ";
    expect(stockfetch.parseTickers(rawData)).to.be.eql(['GOOG']);
  });

  it('processTickers calls getPrice for each ticker symbol', function() {
    var stockfetchMock = sandbox.mock(stockfetch);
    stockfetchMock.expects('getPrice').withArgs('A');
    stockfetchMock.expects('getPrice').withArgs('B');
    stockfetchMock.expects('getPrice').withArgs('C');

    stockfetch.processTickers(['A', 'B', 'C']);
    stockfetchMock.verify();
  });

  it('processTickers saves tickers count', function() {
    sandbox.stub(stockfetch, 'getPrice');

    stockfetch.processTickers(['A', 'B', 'C']);
    expect(stockfetch.tickersCount).to.be.eql(3);
  });

  it('getPrice calls get on http with valid URL', function(done) {
    var httpStub = sandbox.stub(stockfetch.http, 'get', function(url) {
      expect(url).to.be.eql('http://ichart.finance.yahoo.com/table.csv?s=GOOG');
      done();
      return {
        on: function() {}
      };
    });

    stockfetch.getPrice('GOOG');
  });

  it('getPrice sends a response handler to get', function(done) {
    var aHandler = function() {};

    sandbox.stub(stockfetch.processResponse, 'bind')
      .withArgs(stockfetch, 'GOOG')
      .returns(aHandler);

    var httpStub = sandbox.stub(stockfetch.http, 'get',
      function(url, handler) {
        expect(handler).to.be.eql(aHandler);
        done();
        return {
          on: function() {}
        };
    });

    stockfetch.getPrice('GOOG');
  });

  it('getPrice registers handler for failure to reach host', function(done) {
    var errorHandler = function() {};

    sandbox.stub(stockfetch.processHttpError, 'bind')
      .withArgs(stockfetch, 'GOOG')
      .returns(errorHandler);

    var onStub = function(event, handler) {
      expect(event).to.be.eql('error');
      expect(handler).to.be.eql(errorHandler);
      done();
    };

    sandbox.stub(stockfetch.http, 'get').returns({ on: onStub });

    stockfetch.getPrice('GOOG');
  });

  it('processResponse calls parsePrice with valid data', function() {
    var dataFunction;
    var endFunction;

    var response = {
      statusCode: 200,
      on: function(event, handler) {
        if(event === 'data') dataFunction = handler;
        if(event === 'end') endFunction = handler;
      }
    };

    var parsePriceMock =
      sandbox.mock(stockfetch)
        .expects('parsePrice').withArgs('GOOG', 'some data');

    stockfetch.processResponse('GOOG', response);
    dataFunction('some ');
    dataFunction('data');
    endFunction();

    parsePriceMock.verify();
  });

  it('processResponse calls processError if response failed', function() {
    var response = { statusCode: 404 };

    var processErrorMock = sandbox.mock(stockfetch)
      .expects('processError')
      .withArgs('GOOG', 404);

    stockfetch.processResponse('GOOG', response);
    processErrorMock.verify();
  });

  it('processResponse calls processError only if response failed',
    function() {
    var response = {
      statusCode: 200,
      on: function() {}
    };

    var processErrorMock = sandbox.mock(stockfetch)
      .expects('processError')
      .never();

    stockfetch.processResponse('GOOG', response);
    processErrorMock.verify();
  });

  it('processHttpError calls processError with error details',
    function() {
    var processErrorMock = sandbox.mock(stockfetch)
      .expects('processError')
      .withArgs('GOOG', '...error code...');

    var error = { code: '...error code...' };
    stockfetch.processHttpError('GOOG', error);
    processErrorMock.verify();
  });

  var data = "Date,Open,High,Low,Close,Volume,Adj Close\n\
  2015-09-11,619.75,625.780029,617.419983,625.77002,1360900,625.77002\n\
  2015-09-10,613.099976,624.159973,611.429993,621.349976,1900500,621.349976";

  it('parsePrice updates prices', function() {
    stockfetch.parsePrice('GOOG', data);

    expect(stockfetch.prices.GOOG).to.be.eql('625.77002');
  });

  it('parsePrice calls printReport', function() {
    var printReportMock = sandbox.mock(stockfetch).expects('printReport');

    stockfetch.parsePrice('GOOG', data);
    printReportMock.verify();
  });

  it('processError updates errors', function() {
    stockfetch.processError('GOOG', '...oops...');
    // TODO shouldn't this be a stub instead?
    expect(stockfetch.errors.GOOG).to.be.eql('...oops...');
  });

  it('processError calls printReport', function() {
    var printReportMock = sandbox.mock(stockfetch).expects('printReport');

    stockfetch.processError('GOOG', '...oops...');
    printReportMock.verify();
  });

  it('printReport sends price, errors once all responses arrive',
    function() {
    stockfetch.prices = { 'GOOG': 12.34 };
    stockfetch.errors = { 'AAPL': 'error' };
    stockfetch.tickersCount = 2;

    var callbackMock = sandbox.mock(stockfetch)
      .expects('reportCallback')
      .withArgs([['GOOG', 12.34]], [['AAPL', 'error']]);

    stockfetch.printReport();
    callbackMock.verify();
  });

  it('printReport waits for all responses to arrive in order to send',
    function() {
    stockfetch.prices = { 'GOOG': 12.34 };
    stockfetch.errors = { 'AAPL': 'error' };
    stockfetch.tickersCount = 3;

    var callbackMock = sandbox.mock(stockfetch)
      .expects('reportCallback')
      .never();

    stockfetch.printReport();
    callbackMock.verify();
  });

  it('printReport calls sortData once for prices, once for errors',
    function() {
    stockfetch.prices = { 'GOOG': 12.34 };
    stockfetch.errors = { 'AAPL': 'error' };
    stockfetch.tickersCount = 2;

    var mock = sandbox.mock(stockfetch);
    mock.expects('sortData').withArgs(stockfetch.prices);
    mock.expects('sortData').withArgs(stockfetch.errors);

    stockfetch.printReport();
    mock.verify();
  });

  it('sortData sorts the data based on the symbols', function() {
    var dataToSort = {
      'GOOG': 1.2,
      'AAPL': 2.1
    };

    var result = stockfetch.sortData(dataToSort);
    expect(result).to.be.eql([['AAPL', 2.1], ['GOOG', 1.2]]);
  });

  it('getPriceForTickers reports error for invalid file',
  function(done) {
    var onError = function(error) {
      expect(error).to.be.eql('Error reading file: InvalidFile');
      done();
    };
    var display = function() {};

    stockfetch.getPriceForTickers('InvalidFile', display, onError);
  });

  it('getPriceForTickers responds well for a valid file',
  function(done) {
    var onError = sandbox.mock().never();

    var display = function(prices, errors) {
      expect(prices.length).to.be.eql(4);
      expect(errors.length).to.be.eql(1);
      onError.verify();
      done();
    };

    this.timeout(10000);

    stockfetch.getPriceForTickers('mixedTickers.txt', display, onError);
  });
});
