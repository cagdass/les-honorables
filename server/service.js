var mongo_service = require('./mongo_connection');
var Promise = require("bluebird");

/*
  Database service for the server application.
 */

function service(db){
  var service = this;
  var validate = require('validate.js')

  service.find_by_student_name = function(firstName, lastName) {
    return Promise.try(function() {
      return mongo_service.getCollection()
      .then(function(collection) {
        return collection.find({'firstName': {'$regex': firstName, '$options': 'i'}, 'lastName': {'$regex': lastName, '$options': 'i'}});
      })
    })
  }
}

module.exports = service;
