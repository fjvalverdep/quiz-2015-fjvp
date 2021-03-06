var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Este es mi Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//middleware para el auto-logout
app.use(function(req, res, next) {
    if(req.session.user) {  // si hay usuario logado (hay una sesión activa)
      if(!req.session.mySetTime) {  // si no está definida la variable "mySetTime"
        req.session.mySetTime = (new Date()).getTime(); // definimos "mySetTime" con la hora del sistema
      }
      else {  // si la variable "mySetTime" ya está definida
        if((new Date()).getTime() - req.session.mySetTime >15000){ // se comprueba el tiempo transcurrido, y si supera los 2 min. (2min=120000ms) se finaliza la sesión
          delete req.session.user;  // Se borra el usuario
          delete req.session.mySetTime; //  Se borra la variable de tiempo
        }
        else {  //Si no se ha superado el tiempo máximo -hay actividad en la sesión- se actualiza la captura de la hora del sistema
          req.session.mySetTime = (new Date()).getTime();
        }
      }
    }
    next();
});

// Helpers dinámicos:
app.use(function(req, res, next) {

  // Guarda path en session.redir para después de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hace visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
