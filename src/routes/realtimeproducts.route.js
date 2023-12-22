import {Router} from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const path = 'products.json';
const productManager = new ProductManager(path);

router.get('/', async (req,res) => {
    const products = await productManager.getProducts();
    res.render('home', {products});
    
})

router.get('/realtimeproducts', async (req,res)=> {
    res.render('realtimeproducts');
})


export { router as realtimeproducts};