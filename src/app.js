import express from 'express';
import mongoose from 'mongoose';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import __dirname from './utils.js';
import { realtimeproducts } from './routes/realtimeproducts.route.js';
import { productRoute } from './routes/product.route.js';
import { cartRoute } from './routes/cart.route.js';
import ProductManager from './dao/managers/ProductManager.js';
import productModel from './routes/dbProducts.route.js';
import products from './products.js';


const MONGO = 'mongodb+srv://magabrielavercelli:AitYC66JzKrHxPUN@cluster0.azjq6df.mongodb.net/Ecommerce';
mongoose.connect(MONGO)
.then(() => {
    console.log('Conexión a MongoDB exitosa');
    productModel.insertMany(products)
        .then(() => console.log('Productos insertados'))
        .catch(err => console.error('Error al insertar productos:', err));
})
.catch(err => console.error('Error al conectar a MongoDB:', err));


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



app.get('/products', async (req, res) => {
    try {
      const limit = req.query.limit;
      const productsData = await prod.getProducts(); 
  
      if (limit) {
        const productFilter = productsData.slice(0, limit);
        return res.render('products', { products: productFilter });
      }
  
      return res.render('products', { products: productsData });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await prod.getProductById(productId);
    res.render('product', { product: product });
});

const httpServer = app.listen(PORT, () => console.log (`Servidor funcionando en el puerto: ${PORT}`))

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) =>{
    console.log('Nuevo cliente conectado');

    const products = await prod.getProducts();
   
    socket.emit('products', {product: products});
})