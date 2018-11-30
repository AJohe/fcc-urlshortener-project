'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: process.env.TEST});
});

// my schema
const Schema = mongoose.Schema;

const urlSchema = new Schema({
original_url: String,
short_url: Number
});

// my model
const Url = mongoose.model('Url', urlSchema);

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

const randomGen = Math.floor(Math.random() * 1000);
const urlValidator = /^(ftp|http|https):\/\/[^ "]+$/;

app.route("/api/shorturl/new").get((req, res) => {
const original_url = req.query.url;
const short_url = randomGen;
  res.json({
  original_url,
  short_url  
  })
}).post((req, res) => {
const original_url = req.body.url;
const short_url = randomGen;
//find some url validation regex
if(!urlValidator.test(req.body.url)) {
  res.json({error: "Invalid URL"})
}else {
Url.create({original_url, short_url}, (err, data) => {
err ? console.log('error') : console.log(data);
})
  res.json({
  original_url,
  short_url
  })
}
})

//find short url
app.get('/api/shorturl/:num', (req, res) => {
  Url.findOne({short_url: req.params.num}, (err, data) => {
  err ? console.log('url does not exist') : res.redirect(301, data.original_url);
  })
  });

app.listen(port, function () {
  console.log('Node.js listening ...');
});