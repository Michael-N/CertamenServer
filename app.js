var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var scoreTestRouter = require('./routes/api/scoreTest.js');
var generateTestRouter = require('./routes/api/generateTest.js');
var insertQuestionRouter = require('./routes/api/insertQuestion.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/scoretest', scoreTestRouter);
app.use('/api/generatetest', generateTestRouter);
app.use('/api/insertquestion', insertQuestionRouter);


module.exports = app;
