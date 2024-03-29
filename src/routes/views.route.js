import {Router} from 'express';
import ProductManagerDB from '../dao/dbManager/ProductManagerDB.js';
import CartManagerDB from '../dao/dbManager/CartManagerDB.js';


const router = Router();
const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();


const publicAccess = (req,res,next)=> {
    if(req.session.user){
        return res.redirect('/');
        
    }
    next();
}

const privateAccess = (req,res,next)=> {
    if(!req.session.user){
        return res.redirect('/login')
    }
    next();
}

router.get('/register', publicAccess, (req,res)=>{
    res.render('register')
});
router.get('/login', publicAccess, (req,res)=>{
    res.render('login')
})
router.get('/', privateAccess, (req,res)=>{
    res.render('profile', {user:req.session.user}) 
})

router.get('/', async (req,res) => {
    const products = await productManager.getProducts();
    res.render('home', {products});
    
})

router.get('/realtimeproducts', async (req,res)=> {
    res.render('realtimeproducts');
})

router.get('/products', privateAccess, async (req, res) => { //cambiar a prublic?
    try {
        const { limit = 10, page = 1, sort = '', query = ''} = req.query;
        const products = await productManager.getProducts(limit, page, sort, query);
        return res.render('products', {products , user:req.session.user});
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send('Internal Server error');
        
    }
});

router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.render('products', { product: product });
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

router.get('/resetPassword', (req,res)=> {
    res.render('resetPassword');
})


export { router as viewsRoute};