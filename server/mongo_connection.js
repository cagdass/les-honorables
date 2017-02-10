var mongo = require('mongodb').MongoClient;
var default_url = 'mongodb://127.0.0.1:27017/leshonorables';
var default_collection = 'students';
var default_departments = 'departments';

var mongoPromise = mongo.connect(default_url)
.catch(function(error){
  console.error(error);
  throw error
});

var mongo_service = {
  connect: function(url){
    url = url || default_url;
    return mongo.connect(url)
    .catch(function(error){
      console.error(error);
      throw error
    })
  },
  getCollection: function(collection_name = default_collection) {
    return mongoPromise
    .then(function(db){
        var collection = db.collection(collection_name);
        return collection;
    });
  },
  getDepartmentCollection: function(collection_name = default_departments) {
      return mongoPromise
      .then(function(db) {
          var collection = db.collection(collection_name);
          return collection;
    });
  }
};

module.exports = mongo_service;
