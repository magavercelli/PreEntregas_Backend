import {Router} from 'express';
import ProductManager from '../managers/ProductManager.js';

const path = 'products.json';
const router = Router();
const productManager = new ProductManager(path);

router.get('/', async (req,res) => {
    const products = await productManager.getProducts();
      
    res.render('home', { products});
    
})

router.post('/', async (req,res)=> {
    
    const socket = io()

    socket.emit('nuevo_producto', { producto: 'nuevo producto' })

    res.send('Producto creado exitosamente');


})

export { router as realtimeproducts};