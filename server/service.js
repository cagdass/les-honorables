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
					return collection.find({}, {"_id": 0}).toArray();
				})
				.then(function(departments) {
					depts = [];
					for (var i = 0; i < departments.length; i++) {
						var key = Object.keys(departments[i])[0];
						depts.push(key);
					}
					return depts;
				})
				.catch(error => {
					console.log(error);
				});
		});
	}

	service.topSearchedStudents = () => {
	    console.log('service.topSearchedStudents');
		return Promise.try(() => {
			return mongo_service.getCollection()
				.then(collection => {
					const limit = 10;
					// Requesting the top 100 documents for each row corresponds to a semester
					// in a student's academic career. Will go through results
					// until 10 'distinct' students are found based on their first and last name combination.
					return collection.aggregate(
					    {'$match': {'score': {'$gt': 0}}},
					    {'$sort': { 'score': -1 } }, 
					    {'$limit': limit }).toArray();
				   }).catch(error => {
					console.log(error);
				});					
		});
	}

	service.find_student_by_name = function(firstName, lastName, department) {
		return Promise.try(function() {
			return mongo_service.getCollection()
				.then(function(collection) {					
					if (department === "ALL") {
						const query = {'$or': [{'firstName': {'$regex': firstName, '$options': 'i'}, 'lastName': {'$regex': lastName, '$options': 'i'}}, {'firstNameLatin': {'$regex': firstName, '$options': 'i'}, 'lastNameLatin': {'$regex': lastName, '$options': 'i'}}]};
						collection.update(query, { '$inc': { score: 1 } }, { 'upsert': false, 'multi': true });
						return collection.find(query, {'_id': 0}).sort({'firstName': 1, 'lastName': 1, 'semester': 1}).toArray();
					}
					else {
						const query = {'$or': [{'firstName': {'$regex': firstName, '$options': 'i'}, 'lastName': {'$regex': lastName, '$options': 'i'}}, {'firstNameLatin': {'$regex': firstName, '$options': 'i'}, 'lastNameLatin': {'$regex': lastName, '$options': 'i'}}], "department": department};
						collection.update(query, { '$inc': { score: 1 } }, { 'upsert': false, 'multi': true });
						return collection.find(query, {'_id': 0}).sort({'firstName': 1, 'lastName': 1, 'semester': 1}).toArray();
					}
				})
				.catch(error => {
					console.log(error);
				});
		})
	};
}

module.exports = service;
