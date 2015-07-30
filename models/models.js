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

// Usar BBDD SQLite
// var sequelize = new Sequelize(null, null, null,
//                        {
//                        dialect: "sqlite", storage: "quiz.sqlite"
//                        }
//                    );

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exporta definción de la tabla Quiz
exports.Quiz = Quiz;

sequelize.sync().then(function() {          // sequelize.sync() crea e inicializa tabla de preguntas en DB
//sequelize.sync().success(function() {     // ¡¡¡EL MÉTODO "SUCCESS" NO EXISTE EN VERSIONES MÁS ACTUALES DEL MÓDULO SEQUELIZE. SE SUSTITUYE POR MÉTODO "THEN"!!!
  Quiz.count().then(function (count){       // success(..) ejecuta el manejador una vez creada la tabla
  //Quiz.count().success(function (count){  // ¡¡¡EL MÉTODO "SUCCESS" NO EXISTE EN VERSIONES MÁS ACTUALES DEL MÓDULO SEQUELIZE. SE SUSTITUYE POR MÉTODO "THEN"!!!
    if(count === 0) {                       // La tabla se inicializa sólo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                  })
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});
