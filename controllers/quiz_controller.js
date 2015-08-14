var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {

  models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(function(quiz) {
 			if (quiz) {
 				req.quiz = quiz;
 				next();
 			} else {
 				next(new Error('No existe quizId=' + quizId));
 			}
 		}
 	).catch(function(error){ next(error);});
};

// GET /quizes
exports.index = function(req, res) {
    var busqueda_patron = req.query.search || "";
    busqueda_patron = "%" + busqueda_patron.replace(/\s/gi, "%") + "%";

    var busqueda_param = { where: ["pregunta like ?", busqueda_patron], order: 'pregunta ASC'};

    models.Quiz.findAll(busqueda_param).then(function(quizes) {
      res.render('quizes/index', { quizes: quizes, errors: []});
  }).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    //{pregunta: "Pregunta", respuesta: "Respuesta"}
    {pregunta: "Pregunta", respuesta: "Respuesta", tematica: ""}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
    quiz.validate().then(function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        //quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
          quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
          res.redirect('/quizes')
        })
      }  // res.redirect: Redirección HTTP a lista de preguntas
    });
};

//GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;	//autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id/update
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tematica = req.body.quiz.tematica;

	req.quiz.validate().then(function(err){
			if (err) {
				res.render('quizes/edit', {quiz: quiz, errors: err.errors});
			} else { //save: Guarda campos pregunta y respuesta de DB
        //req.quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
				req.quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
          res.redirect('/quizes');});
			} // Redirección HTTP a lista de preguntas (URL relativo)
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

//GET /creditos
exports.author = function(req, res){
  res.render('creditos', {errors: [] });
};
