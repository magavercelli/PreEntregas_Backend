import {Router} from 'express';
import ProductManagerDB from '../dao/dbManager/ProductManagerDB.js';
import CartManagerDB from '../dao/dbManager/CartManagerDB.js';


const router = Router();
const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();

router.get('/', async (req,res) => {
    const products = await productManager.getProducts();
    res.render('home', {products});
    
})

router.get('/realtimeproducts', async (req,res)=> {
    res.render('realtimeproducts');
})

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = ''} = req.query;
        const products = await productManager.getProducts(limit, page, sort, query);
        return res.render('products', {products});
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send('Internal Server error');
        
    }
});

router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.render('product', { product: product });
  });
 
  router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if(cart){
            res.render('cart', { cart: cart });

        }else {
            res.status(400).json({error: `Cart with ID ${cartId} not found`});
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal error server');
        
    }
    
});


export { router as viewsRoute};