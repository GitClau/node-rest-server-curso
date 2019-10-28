require('./config/config');
//es importante que este require esté primero ya que solicita nuestro archivo de configuracion de app ya sea en local o en cloud en PROduccion

const express = require('express');

// Using Node.js `require()`
const mongoose = require('mongoose');



const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())
    // estamos usando el bodyparser para xwwwurlencoded y para json siempre que se ejecute el server.js, se trata de funciones que analizan el body en formato json o bien urlencoded en este caso, son funciones middleware se ejecutan antes que los handlers.

app.use(require('./routes/usuario')); //para poder usar los get, post, put, delete etc debemos importar el código declarado en carpeta routes usuario, también se podrían haber dejado aqui el código
//conexion local
// mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

//     if (err) throw err;

//     console.log('Base de datos online');
// });


//conexion online
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
});