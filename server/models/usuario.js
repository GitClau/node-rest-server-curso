const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //para poner este validador hay que instalar en el paquete del proyecto npm i mongoose-unique-validator --save

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}; //se crea el rol válido para tener en cuenta que roles quiero que se acepten y muestre el error del mensaje en caso de que sea uno que yo no quiero
//esto se hace para role de los usuarios

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, ' el nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el correo es necesario']
    }, // se pone este campo como true dado que queremos que el correo solo se use una vez no puede haber mas de una persona con el mismo correo
    //entonces siempre que queramos un campo como único lo definimos así y lo ponemos a verdadero
    password: {
        type: String,
        required: [true, 'se requiere de contraseña']
    },
    img: {
        type: String,
        required: false
    }, //no es obligatoria
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, //default: 'USER_ROLE'
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false
    } //boolean
});
//para no mostrar al usuario su contraseña a cualquier persona que entre en la base de datos y para ponerlo un poco más dificil se usa methods.toJSON aplicado al objeto schema que vamos a crear
//este método se usa siempre para imprimir objetos (no usar la funcion de flecha donde se usa la palabra function para este caso)
usuarioSchema.methods.toJSON = function() {
        let user = this; // aquí cogemos basicamente el objeto esquema pero en formato json ya que lo hemos pasado a json, el que estamos creando más arriba y se lo asignamos a user
        let userObject = user.toObject(); //aqui pasamos ahora a objeto el json de antes
        delete userObject.password;

        return userObject;
    } //la finalidad de este metodo es coger el objeto pasarlo a json impreso asignarselo a otra variable dentro de esa variable se pasa a objeto nuevamente y se elimina el password para que no salga
    //con esto conservamos el objeto original pero a la hora de mostrarlo no tendrá el password

usuarioSchema.plugin(uniqueValidator, { message: '{PATH}:debe de ser único' }) // este plugin se usa para gestionar el error producido en base de datos al guardar una persona con el mismo correo, cuando el correo por ejemplo no es único

module.exports = mongoose.model('Usuario', usuarioSchema);
// exportamos nuesto modulo llamado usuarioSchema pero le ponemo el nombre de 'Usuario' ya que es más fácil de usar