import express from 'express';
import mongoose from 'mongoose';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import __dirname from './utils.js';
import { realtimeproducts } from './routes/realtimeproducts.route.js';
import { productRoute } from './routes/product.route.js';
import { cartRoute } from './routes/cart.route.js';
import ProductManager from './dao/managers/ProductManager.js';
import ProductManagerDB from './dao/dbManager/ProductManagerDB.js';
import productModel from './dao/models/product.model.js';


const MONGO = 'mongodb+srv://magabrielavercelli:AitYC66JzKrHxPUN@cluster0.azjq6df.mongodb.net/Ecommerce';

mongoose.connect(MONGO)
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));


const PORT = 8080;
const app = express();


const prod = new ProductManager();
const prodDB = new ProductManagerDB();

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
      const limit = parseInt(req.query.limit, 10);
      const page = parseInt(req.query.page, 10);
    
      const productsData = await prodDB.getProducts(req,res); 
  
      if (productsData && productsData.products) {
        // Renderiza la vista de productos con la información de paginación
        return res.render('products', {
            products: productsData.products,
            totalPages: productsData.totalPages,
            prevPage: productsData.prevPage,
            nextPage: productsData.nextPage,
            page: productsData.page,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            prevLink: productsData.prevLink,
            nextLink: productsData.nextLink
        });
    }

    // Si no se proporcionan limit y page, simplemente renderiza la vista de productos
    return res.render('products', { products: [] });

    } catch (error) {
      console.log('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await prodDB.getProductById(productId);
    res.render('product', { product: product });
});

const httpServer = app.listen(PORT, () => console.log (`Servidor funcionando en el puerto: ${PORT}`))

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) =>{
    console.log('Nuevo cliente conectado');

    const products = await prod.getProducts();
   
    socket.emit('products', {product: products});
})