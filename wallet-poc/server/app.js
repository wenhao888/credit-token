var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var account = require("./routes/accountRoute")
const smartTemplate=require("./routes/smartTemplateRoute")
const smartContract = require("./routes/smartContractRoute")
const template = require("./routes/contractTemplateRoute");
const contract = require("./routes/contractRoute");

const loan = require("./routes/loanRoute");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
console.log("dirname " + __dirname);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.use("/api/account", account);

app.use("/api/smart-templates", smartTemplate)
app.use("/api/smart-contracts", smartContract)
app.use("/api/templates", template);
app.use("/api/contracts", contract);

app.use("/api/loans", loan)

app.use('/', async function (req, res){
  res.render("index");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
