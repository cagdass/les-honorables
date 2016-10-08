var mongo_service = require('./mongo_connection');
var Promise = require("bluebird");

/*
  Database service for the server application.
 */

function service(db){
  var service = this;

  service.find_student_by_name = function(firstName, lastName) {
    console.log("Function call!");

    return Promise.try(function() {
      return mongo_service.getCollection()
      .then(function(collection) {
        return collection.find({'firstName': {'$regex': '^' + firstName + '$', '$options': 'i'}, 'lastName': {'$regex': '^' + lastName + '$', '$options': 'i'}}, {'_id': 0}).toArray();
      })
    })
  };
}

module.exports = service;
