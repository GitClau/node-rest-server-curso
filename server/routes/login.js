const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//copiamos las dos constantes del enlace de google https://developers.google.com/identity/sign-in/web/backend-auth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID); // const client = new OAuth2Client(CLIENT_ID); normalmente solo lleva el client_id pero en este caso en concreto no queremos que se sepa el Client id lo definiremos en heroku como esa variable

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o contraseña incorrectos'
                    }
                });
            }

        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //este token caduca en 30 días, también tiene el seed env creado en config y guardado en heroku como variable

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });
    });

});

//configuracion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    // usamos return para generar un usuario personalizado usando las variables creadas en models/usuario.js al princio como imagen nombre email etc, entonces debe ser parecida nuestra salida a la del modelo creado
    // no usamos password no hace falta ya que usamos google sign in

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true //se pone a true

    }

    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}
//verify().catch(console.error);


//para la parte de google es conveniente crearse una pagina donde venga la info para ello hacemos un app post y mostramos nuestro token en consola
app.post('/google', async(req, res) => { //se usa la ruta /google ya que por defecto estaremos ya en google pero se le puede poner lo que queramos siempre y cuando lo indiquemos en el index.html
    //de la carpeta public
    //se le añadió async antes de (req, res) porque usamos un verify que procede de una funcion que dede usar promesas con sincronía

    // let token = req.body.idtoken;

    // res.json({
    //     body: req.body
    // }) con esto podemos ver todo el body de la aplicacion

    //como nos interesa saber directamente el token y no todo el body lo ajustamos para que salga

    let token = req.body.idtoken;

    //verify(token); de primeras se usa para ver si salen por pantalla el nombre el email y la imagen pero ahora que tenemos el catch debemos usarlo de otra manera con async y await

    let googleUser = await verify(token) // esto es una promesa por tanto debe tener un error también en el caso de que falle la respuesta porque haya caducado el token de google en este caso (caduca un mes después de haber creado el espacio version free)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });


    // res.json({
    //     // token //no vamos a devolver el token ahora esto es al princpio para probar a ver si no reonoce y devuelve el token

    //     usuario: googleUser
    // }) no imprimimos más por pantalla ahora toca hacer esto contra la base de datos para comprobar que sean correctos los datos

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => { //creamos la respuesta ante un error de que no exista el usuario en la base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        };

        //si existe el usuario en la base de datos sin que sea de google se deber revisar si la autenticacion se hizo con google que estaría mal y debería 
        //usar el usuario de la base de datos ya que es el que tiene creado(autenticacion normal)
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar autenticacion normal estás intetando identificarte sin correo de google'
                    }
                });
            } else { //podría ser un usuario de google el que se haya identificado y necesita de un usuario de base de datos de allí que se le pedirá
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }

        } else {
            // si el usuario no existe en la base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; //aunque parezca que no es seguro esto pedirá que se haga un match con un código enviado al mail de la persona que tiene el correo así no se podrá usurpar su identidad si no tienes acceso al correo y no puedes usar el código

            usuario.save((err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            });
        }



    });

});
module.exports = app;