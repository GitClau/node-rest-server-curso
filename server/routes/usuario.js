const express = require('express');
const bcrypt = require('bcrypt'); // se debe instalar bcrypt npm i brcypt --save con cmd en el proyecto que se vaya a usar

const _ = require('underscore');

const Usuario = require('../models/usuario'); //se crea usuario como constante con U mayuscula para que no entre en conflicto con las otras variables de usuario


const app = express();

app.get('/', function(req, res) {
    // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html

    res.json('Hello World');
});

app.get('/usuario', function(req, res) {
    // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html

    let desde = req.query.desde || 0; //vamos a definir un inicio desde donde quiero que se hagan las páginas o desde que punto del objeto quiero traerme los valores
    // esta parte solo si se usa para paginacion
    desde = Number(desde); //lo pasamos a un número si o si ya que nos interesa que sea un numero

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // res.json('get Usuario');se descomenta si no se hace paginacion de usuarios para ello se usa el comando find tipico de bases de datos

    //Usuario.find({}, 'nombre email') //si le añadimos despues de "}" esto ", 'nombre email'" entre comillas simples los campos que queremos ver podemos filtrar y ver en pantalla solo esos valores de campos junto con id que está por defecto 
    Usuario.find({})
        .skip(desde) // se salta los 5 primeros como máximo, lo hemos cambiado a desde para que coja un número en concreto guardado en una variable llamada desde
        .limit(desde) //solo coge los 10 siguientes al salto como máximo. se puede jugar con skip y limit para coger diferentes parametros según interese por ejemplo podemos coger los 3 primeros unsado limit(3) y despues skip(3)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            // que pasaria si quisieramos contar el numero de registros
            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                });
            });

            // res.json({
            //     ok: true,
            //     usuarios: usuarios
            // })

        });

    // // si queremos indicarle un parámetro de busqueda con un valor conreto debemos tenerlo en el fin y en el count ya que primero hace find y luego count es un callback dentro de otro callback
    // //en este caso intentamos sacar cuantos usuarios tiene en base de datos el usuario de google a true es decir cuantos usan gmail
    // //cuidado con los limites puestos en postman si no sale en pantalla poner a 0 el desde
    // Usuario.find({ google: true })
    //     .skip(desde) // se salta los 5 primeros como máximo, lo hemos cambiado a desde para que coja un número en concreto guardado en una variable llamada desde
    //     .limit(desde) //solo coge los 10 siguientes al salto como máximo. se puede jugar con skip y limit para coger diferentes parametros según intere por ejemplo podemos coger los 3 primeros unsado limit(3) y despues skip(3)
    //     .exec((err, usuarios) => {
    //         if (err) {
    //             res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         // que pasaria si quisieramos contar el numero de registros
    //         Usuario.count({ google: true }, (err, conteo) => {
    //             res.json({
    //                 ok: true,
    //                 usuarios: usuarios,
    //                 cuantos: conteo
    //             });
    //         });

    //         // res.json({
    //         //     ok: true,
    //         //     usuarios: usuarios
    //         // })

    //     });



});

// //ejercicio con el get para coger solo usuarios activos y que cuente solo los activos
// // {estado: true}

// app.get('/usuario', function(req, res) {

//     let desde = req.query.desde || 0; //vamos a definir un inicio desde donde quiero que se hagan las páginas o desde que punto del objeto quiero traerme los valores
//     // esta parte solo si se usa para paginacion
//     desde = Number(desde); //lo pasamos a un número si o si ya que nos interesa que sea un numero

//     let limite = req.query.limite || 5;
//     limite = Number(limite);

//     // res.json('get Usuario');se descomenta si no se hace paginacion de usuarios para ello se usa el comando find tipico de bases de datos

//     //Usuario.find({}, 'nombre email') //si le añadimos despues de "}" esto ", 'nombre email'" entre comillas simples los campos que queremos ver podemos filtrar y ver en pantalla solo esos valores de campos junto con id que está por defecto 
//     Usuario.find({ estado: true })
//         .skip(desde) // se salta los 5 primeros como máximo, lo hemos cambiado a desde para que coja un número en concreto guardado en una variable llamada desde
//         .limit(desde) //solo coge los 10 siguientes al salto como máximo. se puede jugar con skip y limit para coger diferentes parametros según interese por ejemplo podemos coger los 3 primeros unsado limit(3) y despues skip(3)
//         .exec((err, usuarios) => {
//             if (err) {
//                 res.status(400).json({
//                     ok: false,
//                     err
//                 });
//             }

//             // que pasaria si quisieramos contar el numero de registros
//             Usuario.count({ estado: true }, (err, conteo) => {
//                 res.json({
//                     ok: true,
//                     usuarios: usuarios,
//                     cuantos: conteo
//                 });
//             });

//         });


// });

app.post('/usuario', function(req, res) {
    // // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html
    // let body = req.body //dado que se usa el body parser se crea ahora el body para mostrarlo por pantalla


    // //res.json('post Usuario'); //si se hace una peticion post y no está declarada en el server dirá que no entiende nada y que no puede hacer el post con la direccion indicada
    // res.json({
    //     persona: body
    // }); //dado que hemos creado el body ahora lo podemos tambien mostrar


    // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html
    let body = req.body //dado que se usa el body parser se crea ahora el body para mostrarlo por pantalla


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //si se ha declarado el bcrypt al principio del proyecto y se ha instalado
        role: body.role

    }); //aqui es donde let usuario está en minuscula la u para diferenciarlo del Usuario con U mayuscula procedente del modelo

    usuario.save((err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.paswword = null; // si queremos que en la pantalla no se vea la contraseña se le puede decir que una vez haya creado la contraseña del usuario la debe poner a null
        // // pero esto no es muy seguro ya que le estamos diciendo a quien acceda  a la base de datos que esto es la contraseña de la otra persona

        res.json({
            ok: true,
            usuario: usuarioDB
        }); // el status 200 no hace falta ponerlo va implicito
    });



    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'me hace falta un nombre'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     }); //dado que hemos creado el body ahora lo podemos tambien mostrar
    // } si no se usa usuario desde base de datos descomentar este bloque


});

app.put('/usuario/:id', function(req, res) {
    // se le ha puesto : id para indicar en la url que queremos obtener el put contra la direccion de un usuario en concreto para ello hay que configurarle la variable id

    let id = req.params.id; // esto de req params id es una estructura dada req es nuestro parametro de entrada
    // let body = req.body;//como se ha usado underscore hay que cambiarlo e indicarle a que parametros debe hacerle el pick estos parametros serán los que se pueden cambiar el resto no
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    //la forma cutre y rápida de impedir que se altetren los campos de la base de datos es usando delete indicandole el parametro que no debe cambiar
    // delete body.password;
    // delete body.google;
    //pero no se recomienda usar esta forma es mejor usar la del underscore con pick


    //mongo tiene varias funciones que permiten operar con los valores de los campos del usuario
    //findById busca según el id cuando se quiere encontrar una valor en concreto
    //findByIdAndUpdate buscar por un valor y actualizarlo y otras muchas
    //vamos a probar con esta estructura A.findByIdAndUpdate(id, update, callback) donde A es el array Usuario, id es nustro campo id, el update es nuestro body,
    // y nuestro callback es nuestra funcion cuyos parametros son el err y el usuarioDB 
    // Usuario.findByIdAndUpdate(id, body, (err, usuarioDB) => {// con esta sentencia en pantalla no se ve la actualizacion del usuario para ello debemos usar new en el parametro options A.findByIdAndUpdate(id, update, options, callback)
    // new: true permite renovar en pantalla el valor de los campos del usuario, runValidators:true es una opcion para el role y otros campos en los cuales aunque se hayan definido unos valores admitidos al meter cualquier cosa fallan
    //entonces runValidators a true evita que se puedan escribir cosas raras por pantalla y se guarden en la base de datos, solo se admitiran los valores definidos por ejemplo para role solo aceptara ADMIN_ROLE y USER_ROLE que son los definidos
    //aún así esto puede dar problemas con otros campos si se usa runValidators hay que usar underscore también para ello hacemos npm install underscore --save en cmd en la carpeta de proyecto
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }





            res.json({
                //lo que queremos mostrar en este caso no es el id solo sino todo el objeto
                ok: true,
                usuario: usuarioDB
            }); // cometar todo el bloque y descomentar el bloque 1 abajo si no se quiere usar el findbyidandupdate
        })
        // //bloque 1
        // res.json({
        //     //id: id // tsmbien se puede dejar solo id sin necesidad de poner :id ya que ecma script 6 no lo necesita.
        //     id
        // }); //se da respuesta en formato json y se hace al parametro id

    // res.json('put Usuario'); //si se hace una peticion post y no está declarada en el server dirá que no entiende nada y que no puede hacer el post con la direccion indicada
});


app.delete('/usuario/:id', function(req, res) {
    // res.send('Hello World')// si la informacion a enviar es en formato json se usa directamente en vez de send ya que esto ultimo es html

    //el delete como tal para borar algo por completo no se usa. se usa para cambiar el valor del campo "estado" esto pemitirá poner a false estado y así seguimos guardando el objeto en la base de datos para algunas referencias o compras pendientes 

    //res.json('delete Usuario'); //si se hace una peticion post y no está declarada en el server dirá que no entiende nada y que no puede hacer el post con la direccion indicada

    //esta forma borra fisicamente el elemento de la base de datos pero no es la que se va a usar pero está bien tenerla de ejemplo
    let id = req.params.id; //el id despues de params. es el id de '/usuario/:id'

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {// esta forma se descomenta y sirve para borar por completo el dato de la base de datos

    //esta forma permite actualizar el valor de uno de los campos cuando se usa la funcion delete
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {


        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        };

        if (usuarioBorrado === null) {
            res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });



    });

});

module.exports = app; //se puede exportar todo el archivo