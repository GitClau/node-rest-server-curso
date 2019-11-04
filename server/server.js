require('./config/config');
//es importante que este require esté primero ya que solicita nuestro archivo de configuracion de app ya sea en local o en cloud en PROduccion

const express = require('express');

// Using Node.js `require()`
const mongoose = require('mongoose');

const path = require('path');

const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())
    // estamos usando el bodyparser para xwwwurlencoded y para json siempre que se ejecute el server.js, se trata de funciones que analizan el body en formato json o bien urlencoded en este caso, son funciones middleware se ejecutan antes que los handlers.



// habilitar la carpeta public creada para poder usar el sign in
// app.use(express.static(__dirname + '../public')); //esto presentará un problema para que no sea un problema necesitamos crear la variable o constante path
//se comprueba con un console log que tras ponerle el path resolve devuelve bien la ruta del archivo en local
// console.log(path.resolve(__dirname + '../public'));
// console.log(path.resolve(__dirname, '../public')); se cambia el + por una coma para concatenar


//como se ha comprobado que funciona el path correctamente usamos path dentro de la ruta para que no sea un problema se cambia el "+" por una ",
app.use(express.static(path.resolve(__dirname, '../public')));



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