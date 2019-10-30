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

//desde aqui se llevó al index de routes, todo, volver a pegar si hiciera falta por eso lo sustituimos por la siguiente
//configuracion global de rutas
app.use(require('./routes/index'));

//conexion online
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
});