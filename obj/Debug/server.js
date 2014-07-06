
//set up--------------------------
var express = require('express');
var app = express();
var orientdb = require('node-orientdb-http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = orientdb.connect({
    host: "http://localhost:2480",
    user: "admin",
    password: "admin",
    database: "TODO"
});

db.on('connect', function() {
    console.log("Connected!");
});

db.on('error', function(err) {
    // mmm error ..
});

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));    //set the static files location /public

// API routes
app.get('/api/todos', function(req, res){
    db.query("select from Todo").then(function(result){
        res.json(result.result);
    }, function(err){
        res.send(err);
    });
});

app.post('/api/todos', function(req, res){

    var commandToSend = 'insert into Todo set text = "' + req.body.text + '"';
    db.command(commandToSend, null, req.body).then(function(result){
        db.query("select from Todo").then(function(result){
            res.json(result.result);
        }, function(err){
            console.log(err.msg);
            res.send(err);
        });
    }, function(err){
        console.log(err);
        res.send(err);
    });
});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    var commandToSend = 'delete from #' + req.params.todo_id;
    db.command(commandToSend, null, req.body).then(function(result){
        db.query("select from Todo").then(function(result){
            res.json(result.result);
        }, function(err){
            console.log(err.msg);
            res.send(err);
        });
    }, function(err){
        console.log(err);
        res.send(err);
    });
});


// Application routes
app.get('*', function(req, res){
   res.sendfile('./public/index.html'); //load the single view file (angular will handle the page changes on the front-end)
});





// listen (start app with node server.js
app.listen(3000);
console.log("app listening on port 3000");