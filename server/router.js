module.exports = (function() {
    'use strict';

    var express = require('express');
    var bodyParser = require('body-parser')
    var service = require('./service')
    var service_instance = new service();
    var router = require('express').Router();

    router.use(bodyParser.json());

    router.get('/departments', function(req, res) {
      service_instance.find_departments()
      .then(function(result) {
        if (result == null) {
          res.status(404).send(result);
        }
        else {
          res.status(200).send(result);
        }
      })
      .catch(function(error) {
        console.error(error);
      })
    })	

    router.get('/student', function(req, res) {
        // Parameters.
        var firstName = req.query.firstName;
        var lastName = req.query.lastName;
        var department = req.query.department;

        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        console.log(`Finding student with name ${firstName + " " + lastName}. Request from ${ip} Time ${Date()}`);
        service_instance.find_student_by_name(firstName, lastName, department)
        .then(function(result){
            if(result == null){
                res.status(404).send(result);
            }
            else{
                res.status(200).send(result);
            }
        })
        .catch(function(error){
            console.error(error);
        })
    });

	router.get('/top_students', (req, res) => {
		service_instance.topSearchedStudents()
			.then(response => {
				if (response === null) {
					res.status(404).send(response);
				} else {
					res.status(200).send(response);
				}
			})
			.catch(error => {
				console.error(error);
			});
	
    return router;
})();
