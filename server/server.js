require('./config/config');
//es importante que este require esté primero ya que solicita nuestro archivo de configuracion de app ya sea en local o en cloud en PROduccion

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())
    // estamos usando el bodyparser para xwwwurlencoded y para json siempre que se ejecute el server.js, se trata de funciones que analizan el body en formato json o bien urlencoded en este caso, son funciones middleware se ejecutan antes que los handlers.


app.get('/', function(req, res) {
    // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html

    res.json('Hello World');
});

app.get('/usuario', function(req, res) {
    // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html

    res.json('get Usuario');
});

app.post('/usuario', function(req, res) {
    // // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html
    // let body = req.body //dado que se usa el body parser se crea ahora el body para mostrarlo por pantalla


    // //res.json('post Usuario'); //si se hace una peticion post y no está declarada en el server dirá que no entiende nada y que no puede hacer el post con la direccion indicada
    // res.json({
    //     persona: body
    // }); //dado que hemos creado el body ahora lo podemos tambien mostrar


    // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html
    let body = req.body //dado que se usa el body parser se crea ahora el body para mostrarlo por pantalla

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'me hace falta un nombre'
        });
    } else {
        res.json({
            persona: body
        }); //dado que hemos creado el body ahora lo podemos tambien mostrar
    }


});

app.put('/usuario/:id', function(req, res) {
    // se le ha puesto : id para indicar en la url que queremos obtener el put contra la direccion de un usuario en concreto para ello hay que configurarle la variable id

    let id = req.params.id; // esto de req params id es una estructura dada req es nuestro parametro de entrada

    res.json({
        id: id // tsmbien se puede dejar solo id sin necesidad de poner :id ya que ecma script 6 no lo necesita.
    }); //se da respuesta en formato json y se hace al parametro id

    // res.json('put Usuario'); //si se hace una peticion post y no está declarada en el server dirá que no entiende nada y que no puede hacer el post con la direccion indicada
});


app.delete('/usuario', function(req, res) {
    // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html

    res.json('delete Usuario'); //si se hace una peticion post y no está declarada en el server dirá que no entiende nada y que no puede hacer el post con la direccion indicada
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
});