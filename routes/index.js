/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
