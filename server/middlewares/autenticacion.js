const jwt = require('jsonwebtoken');

//=========
//verificar token
//=========
let verificarToken = (req, res, next) => {

    let token = req.get('token') // Authorization si se usa esto en vez de token hay que cambiarlo dentro del get

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }



        req.usuario = decoded.usuario;

        next();


    });
    // res.json({
    //     token: token
    // }); para que no se vea el token y se ejecute la siguiente parte del código y muestre la siguiente respuesta se usa next

    //console.log(token); //si queremos verlo en consola pero no se recomienda
};


//como solo queremos que los admins puedan crear usuarios con token tenemos que controlar eso

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();

    } else {

        return res.json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }
        });
    }



};

module.exports = {
    verificarToken,
    verificaAdmin_Role
}