import express from 'express';
import mongoose from 'mongoose';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import __dirname from './utils.js';
import { viewsRoute } from './routes/views.route.js';
import productRoute  from './routes/products.route.js';
import cartRoute  from './routes/carts.route.js';
//import ProductManager from './dao/managers/ProductManager.js';
//import ProductManagerDB from './dao/dbManager/ProductManagerDB.js';



const MONGO = 'mongodb+srv://magabrielavercelli:AitYC66JzKrHxPUN@cluster0.azjq6df.mongodb.net/Ecommerce';

mongoose.connect(MONGO)
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));


const PORT = 8080;
const app = express();



app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.use('/', viewsRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);






const httpServer = app.listen(PORT, () => console.log (`Servidor funcionando en el puerto: ${PORT}`))

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) =>{
    console.log('Nuevo cliente conectado');

    const products = await prod.getProducts();
   
    socket.emit('products', {product: products});
})