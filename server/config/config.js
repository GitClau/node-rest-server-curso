//aqui añadimos las diferentes variables constantes a lo largo de la creacion del servico tanto en local como en cloud


//puerto

process.env.PORT = process.env.PORT || 3000;


//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//vencimiento del token
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



//SEED de autentificacion

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'; //aqui creamos en heroku una variable llamada SEED que exista en la app en Produccion
//con esto evitamos que se sepa nuestra semilla en el archivo de produccion







//base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {


    urlDB = process.env.MONGO_URI; // esto se creo una variables en heroku llamada MONGO_URI y se le dió el valor que nos interesa guardado en un archivo llamada ocultar info en....



}
process.env.URLDB = urlDB;


//definimos un client ID en heroku para conservarlo y que no sea publico y por eso lo declaramos aqui


process.env.CLIENT_ID = process.env.CLIENT_ID || '699236419260-36tn16fq1cnsgm5mlg2css8merhagg4o.apps.googleusercontent.com';