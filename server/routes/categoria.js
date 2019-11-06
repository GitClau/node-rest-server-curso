const express = require('express');

let { verificarToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//un servicio mostrar todas las categorias

app.get('/categoria', (req, res) => {




    //Usuario.find({}, 'nombre email') //si le añadimos despues de "}" esto ", 'nombre email'" entre comillas simples los campos que queremos ver podemos filtrar y ver en pantalla solo esos valores de campos junto con id que está por defecto 
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') //queremos obtener dentro de categoria solo los usuarios con su nombre y su email, el id se obtendrá siempre por defecto no hay que ponerlo
        // .populate('schemax', 'y z') si tenemos más de un schema que no sea solo usuarios deberiamos crearnos tantos populate como schemas haya y mostrar solo los campos que nos interesan
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // // que pasaria si quisieramos contar el numero de registros
            // Categoria.count({}, (err, conteo) => {
            //     return res.json({
            //         ok: true,
            //         usuarios: usuarios,
            //         cuantos: conteo
            //     });
            // });

            res.json({
                ok: true,
                categorias
            });

        });
});

// mostrar una categoria por id

app.get('/categoria/:id', (req, res) => {
    //Categoria.findById(....)

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


// crear una nueva categoria 

app.post('/categoria', verificarToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id


    let body = req.body; //dado que se usa el body parser se crea ahora el body para mostrarlo por pantalla


    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id

    }); //aqui es donde let usuario está en minuscula la u para diferenciarlo del Usuario con U mayuscula procedente del modelo

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) { //si hizo la categoriaDB no deberia dar este error
            return res.status(400).json({
                ok: false,
                err
            });
        }


        // usuarioDB.paswword = null; // si queremos que en la pantalla no se vea la contraseña se le puede decir que una vez haya creado la contraseña del usuario la debe poner a null
        // // pero esto no es muy seguro ya que le estamos diciendo a quien acceda  a la base de datos que esto es la contraseña de la otra persona

        res.json({
            ok: true,
            categoria: categoriaDB
        }); // el status 200 no hace falta ponerlo va implicito
    });
});

// Put de todas las categoria 

app.put('/categoria/:id', verificarToken, (req, res) => {
    // se le ha puesto : id para indicar en la url que queremos obtener el put contra la direccion de un usuario en concreto para ello hay que configurarle la variable id

    let id = req.params.id; // esto de req params id es una estructura dada req es nuestro parametro de entrada
    //si se usa underscore hay que cambiarlo e indicarle a que parametros debe hacerle el pick como en el caso de models/usuario.js estos parametros serán los que se pueden cambiar el resto no
    let body = req.body //en este caso no nos interesa obtener todo el body pero primero recogemos todo el body
        //como nos interesa solo la descripcion creamos una variable y le definimos solo la descripcion como parametro
    let descCategoria = {
        descripcion: body.descripcion
    }

    //aún así esto puede dar problemas con otros campos si se usa runValidators hay que usar underscore también para ello hacemos npm install underscore --save en cmd en la carpeta de proyecto
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) { //si hizo la categoriaDB no deberia dar este error
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            //lo que queremos mostrar en este caso no es el id solo sino todo el objeto
            ok: true,
            categoria: categoriaDB
        });
    })

});

// Put de todas las categoria 

app.delete('/categoria/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador puede borrar categorías
    //Categoría.findByIdAndRemove


    //esta forma borra fisicamente el elemento de la base de datos pero no es la que se va a usar pero está bien tenerla de ejemplo
    let id = req.params.id; //el id despues de params. es el id de '/usuario/:id'

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {// esta forma se descomenta y sirve para borar por completo el dato de la base de datos

    //esta forma permite actualizar el valor de uno de los campos cuando se usa la funcion delete


    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) { //si hizo la categoriaDB no deberia dar este error
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }

        res.json({
            ok: true,
            // categoria: categoriaDB// podemos mostrar la categoria o bien poner el mensaje
            message: 'categoría borrada'
        });



    });

});



module.exports = app;