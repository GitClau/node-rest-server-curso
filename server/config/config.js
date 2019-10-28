//aqui añadimos las diferentes variables constantes a lo largo de la creacion del servico tanto en local como en cloud


//puerto

process.env.PORT = process.env.PORT || 3000;


//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos

let urlDB;

// if (process.env.NODE_ENV === 'dev') {
// urlDB = 'mongodb://localhost:27017/cafe'
// } else {


urlDB = 'mongodb+srv://claudiu:cs123456@cluster0-qicgb.mongodb.net/cafe';
// urlDB = 'mongodb://claudiu:cs123456@cluster0-shard-00-01-qicgb.mongodb.net:27017';


// }
process.env.URLDB = urlDB;