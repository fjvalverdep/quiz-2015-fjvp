var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Carga Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
                    { dialect:  protocol,
                      protocol: protocol,
                      port:     port,
                      host:     host,
                      storage:  storage,  // solo SQLite (.env)
                      omitNull: true      // solo Postgres
                    }
                  );

// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar la definición de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// Se define la relación entre las tablas 1 a N
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exporta definición de la tabla Quiz
exports.Quiz = Quiz;
// Exporta definición de la tabla Comment
exports.Comment = Comment;

sequelize.sync().then(function() {          // sequelize.sync() crea e inicializa tabla de preguntas en DB
  Quiz.count().then(function (count){       // then(..) ejecuta el manejador una vez creada la tabla
    if(count === 0) {                       // La tabla se inicializa sólo si está vacía
      Quiz.bulkCreate(
        [ { pregunta: 'Capital de Italia', respuesta: 'Roma', tematica: 'Humanidades'},
          { pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tematica: 'Humanidades'},
          { pregunta: 'Tercer planeta del Sistema Solar', respuesta: 'Tierra', tematica: 'Ciencias'},
          { pregunta: 'Animal que representa al S.O. Linux', respuesta: 'Pingüino', tematica: 'Tecnología'},
        ]
      ).then(function(){console.log('Base de datos inicializada')});
    };
  });
});
