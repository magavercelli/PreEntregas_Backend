import express from 'express';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import __dirname from './utils.js';
import { realtimeproducts } from './routes/realtimeproducts.route.js';
import { productRoute } from './routes/product.route.js';
import { cartRoute } from './routes/cart.route.js';
import ProductManager from './managers/ProductManager.js';

const PORT = 8080;
const app = express();

const prod = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use('/', realtimeproducts);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);

const httpServer = app.listen(PORT, () => console.log (`Servidor funcionando en el puerto: ${PORT}`))

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) =>{
    console.log('Nuevo cliente conectado');

    const products = await prod.getProducts();
   
    socket.emit('products', {product: products});
})