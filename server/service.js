var mongo_service = require('./mongo_connection');
var Promise = require("bluebird");

/*
  Database service for the server application.
 */

function service(db){
  var service = this;

  service.find_departments = function() {
    return Promise.try(function() {
      return mongo_service.getDepartmentCollection()
      .then(function(collection) {
        return collection.find({});
      })
    });
  }

  service.find_student_by_name = function(firstName, lastName, department) {
    return Promise.try(function() {
      return mongo_service.getCollection()
      .then(function(collection) {
        if (department == "ALL") {
          return collection.find({'$or': [{'firstName': {'$regex': firstName, '$options': 'i'}, 'lastName': {'$regex': lastName, '$options': 'i'}}, {'firstNameLatin': {'$regex': firstName, '$options': 'i'}, 'lastNameLatin': {'$regex': lastName, '$options': 'i'}}]}, {'_id': 0}).sort({'firstName': 1, 'lastName': 1, 'semester': 1}).toArray();
        }
        else {
          return collection.find({'$or': [{'firstName': {'$regex': firstName, '$options': 'i'}, 'lastName': {'$regex': lastName, '$options': 'i'}}, {'firstNameLatin': {'$regex': firstName, '$options': 'i'}, 'lastNameLatin': {'$regex': lastName, '$options': 'i'}}], "department": department}, {'_id': 0}).sort({'firstName': 1, 'lastName': 1, 'semester': 1}).toArray();
        }
      })
    })
  };
}

module.exports = service;
