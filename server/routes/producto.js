const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');


let app = express();
let Producto = require('../models/producto');


// ===========================
//  Obtener productos
// ===========================
app.get('/productos', verificarToken, (req, res) => {
    // trae todos los productos disponibles a true
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0; // puede venir de una variable desde que tengamos guardada pero por si acaso dejamos que sea también desde 0 si no encuentra el desde
    desde = Number(desde); //como viene en string se transforma en un numero usando la funcion number propia de nodejs

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });


        })

});

// ===========================
//  Obtener un producto por ID
// ===========================
app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

// ===========================
//  Buscar productos
// ===========================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    // Producto.find({ nombre: termino })//esto no es una forma muy eficiente de buscar terminos ya que debo saber el nombre exacto pero serviría para hacer la busqueda mejor usar un regex que pueden ponerse terminos incompletos o parecidos y los encuentra más veces
    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })


});



// ===========================
//  Crear un nuevo producto
// ===========================
app.post('/productos', verificarToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    //no hace falta crear let categoría ya que estamos en producto y el resto de cosas deben de llegar desde el otro modulo

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

// ===========================
//  Actualizar un producto
// ===========================
app.put('/productos/:id', verificarToken, (req, res) => {
    // actualizar el producto y guardarlo


    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        // para actualizar el producto en la base de datos hay una manera facil de hacerlo siempre y cuando se sepan los valores de los parametros

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });

    // ///// tambien se puede hacer de esta otra forma que es como se hizo en categoría pero puede presentar campos de valores nulos ya que intenta buscar que todos los campos estén completos, es mejor la opcion de arriba pero esta sería válida también
    // //utilizar esta forma si no se quieren borrar campos de la base de datos dado que la anterior forma si borra campos

    //     let id = req.params.id; // esto de req params id es una estructura dada req es nuestro parametro de entrada
    //     //si se usa underscore hay que cambiarlo e indicarle a que parametros debe hacerle el pick como en el caso de models/usuario.js estos parametros serán los que se pueden cambiar el resto no
    //     let body = req.body //en este caso no nos interesa obtener todo el body pero primero recogemos todo el body
    //         //como nos interesa solo la descripcion creamos una variable y le definimos solo la descripcion como parametro
    //     let actuaProducto = {
    //         nombre: body.nombre,
    //         precioUni: body.precioUni,
    //         categoria: body.categoria,
    //         disponible: body.disponible,
    //         descripcion: body.descripcion
    //     }

    //     //aún así esto puede dar problemas con otros campos si se usa runValidators hay que usar underscore también para ello hacemos npm install underscore --save en cmd en la carpeta de proyecto
    //     Producto.findByIdAndUpdate(id, actuaProducto, { new: true, runValidators: true }, (err, productoDB) => {
    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         if (!productoDB) { //si hizo la categoriaDB no deberia dar este error
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }


    //         productoDB.save((err, productoGuardado) => {

    //             if (err) {
    //                 return res.status(500).json({
    //                     ok: false,
    //                     err
    //                 });
    //             }

    //             res.json({
    //                 ok: true,
    //                 producto: productoGuardado
    //             });

    //         });

    //     });




});

// ===========================
//  Borrar un producto
// ===========================
app.delete('/productos/:id', verificarToken, (req, res) => {
    //solo actualizamos el estado del producto de disponible a true a false en este caso no lo borramos 

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        })

    })


});






module.exports = app;