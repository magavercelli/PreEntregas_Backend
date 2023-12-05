import express from 'express';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import { realtimeproducts } from './routes/realtimeproducts.route.js';
import { productRoute } from './routes/product.route.js';
import { cartRoute } from './routes/cart.route.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

const httpServer = app.listen(PORT, () => console.log (`Servidor funcionando en el puerto: ${PORT}`))

const socketServer = new Server(httpServer);

app.engine('handlebars', engine());

app.set('view', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
socketServer.on('connectio', socket =>{
    console.log('Nuevo cliente conectado');
    socket.on('message', data => { // MODIFICAR
        console.log(data);
    })
})

app.use('/', realtimeproducts);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })