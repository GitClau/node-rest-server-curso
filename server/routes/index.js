const express = require('express');

const app = express();

// app.use(require('./routes/usuario')); //para poder usar los get, post, put, delete etc debemos importar el código declarado en carpeta routes usuario, también se podrían haber dejado aqui el código
// //conexion local
// // mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

// //     if (err) throw err;

// //     console.log('Base de datos online');
// // });

// //para la parte de login

// app.use(require('./routes/login'));

// las rutas de arriba solo se usan si se ponen en el server.js que está fuera de la carpeta routes como aqui ya estamos dentro directamente le cambiamos las rutas a las siguientes

app.use(require('./usuario'));
app.use(require('./login'));

// para el ejercicio de la categoria hay que importar también la categoríaasí nos aseguramos que se arrastra a los siguientes archivos y que se pueden hacer las peticiones get post etc a la ruta especificada
app.use(require('./categoria'));
//
app.use(require('./producto'));


module.exports = app;