var models = require('../models/models.js');

//GET /quizes/question
exports.question = function(req, res) {
  //models.Quiz.findAll().success(function(quiz) {      // ¡¡¡EL MÉTODO "SUCCESS" NO EXISTE EN VERSIONES MÁS ACTUALES DEL MÓDULO SEQUELIZE. SE SUSTITUYE POR MÉTODO "THEN"!!!
  models.Quiz.findAll().then(function(quiz) {
    //res.render('quizes/question', {pregunta: 'Capital de Italia'});
    res.render('quizes/question', {pregunta: quiz[0].pregunta})
  })
};

//GET /quizes/answer
exports.answer = function(req, res){
  //models.Quiz.findAll().success(function(quiz) {      // ¡¡¡EL MÉTODO "SUCCESS" NO EXISTE EN VERSIONES MÁS ACTUALES DEL MÓDULO SEQUELIZE. SE SUSTITUYE POR MÉTODO "THEN"!!!
  models.Quiz.findAll().then(function(quiz) {
    //if (req.query.respuesta === 'Roma'){
    if (req.query.respuesta === quiz[0].respuesta){
      res.render('quizes/answer', {respuesta: 'Correcto'});
    }
    else {
      res.render('quizes/answer', {respuesta: 'Incorrecto'});
    }
  })
};

//GET /creditos
exports.author = function(req, res){
  res.render('creditos', {});
};
