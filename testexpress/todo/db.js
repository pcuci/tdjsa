var MongoClient = require('mongodb').MongoClient;

module.exports = {
  connection: null,
  get: function() {
    return this.connection;
  },
  close: function() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  },
  connect: function(dbname, callback) {
    var self = this;

    var cacheConnection = function(err, db) {
      self.connection = db;
      callback(null);
    }
    try {
      MongoClient.connect(dbname, cacheConnection);
    } catch(err) {
      callback(err);
    }
  }
}
