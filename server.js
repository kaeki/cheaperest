#!/bin/env node
 
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var fs      = require('fs');
var mongodb = require('mongodb');
 
var apiApp = function () {
 
    var self = this;

    self.getConf = function () {
    
        console.log("mongo");
        // 1. KONFIGURAATIO
        
        // default to a 'localhost' configuration:
        var connection_string = '127.0.0.1:27017/barbababa';
        // if OPENSHIFT env variables are present, use the available connection info:
        if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
          connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
          process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
          process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
          process.env.OPENSHIFT_APP_NAME;
        }
    return connection_string;
    };

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        "extended": false
    }));
 
    app.use(express.static('static'));
 
    router.get("/", function (req, res) {
        res.json({
            "error": false,
            "message": "Hello World"
        });
    });
 
    //Routing example
    router.route("/test").get(function (req, res) {
        var response = {
            "text": "hello world!"
        };
        res.json(response);
    });
    router.route("/bars").get(function(req, res){
        var connection_string = self.getConf();
        var MongoClient = require('mongodb').MongoClient;  
        // the client db connection scope is wrapped in a callback:
        MongoClient.connect('mongodb://' + connection_string, function (err, db) {
            if (err) throw err;
            var collection = db.collection('bars').find().limit(100).toArray(function (err, docs) {
                console.dir(docs);
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.send(docs);
                db.close();
            });
        });
    });

    router.route("/saveBar").get(function(req, res){
        var connection_string = self.getConf();
        var MongoClient = require('mongodb').MongoClient;  
        // the client db connection scope is wrapped in a callback:
        MongoClient.connect('mongodb://' + connection_string, function (err, db) {
            var name = req.body.name;
            var address = req.body.address;
            var postCode = req.body.postCode;
            var city = req.body.city;
            var lat = parseFloat(req.body.lat);
            var lon = parseFloat(req.body.lon);
            self.db.collection('bars').insert( {'name':name, 'address':address, 'postCode':postCode, 'city': city, 'location':[lon,lat]}, function(err, records){
            if (err) { throw err; }
            res.send('success');
            });
            db.close();
        });
    });
 
    app.use('/', router);
 
    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
        var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
        app.listen(port, ipaddress, function () {
            console.log((new Date()) + ' Server is listening on port 8080');
        });
    };
};
 
var zapp = new apiApp();
zapp.start();