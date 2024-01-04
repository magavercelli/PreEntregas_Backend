import {Router} from 'mongoose';
import CartManagerDB from '../dao/dbManager/CartManagerDB.js';

const router = Router();

const cartManagerDb= new CartManagerDB();

router.get('/', async (req, res)=> {
    const cart = await cartManagerDb.getCarts();
    res.send({
        status: 'succes',
        msg: `get ${cart} succesefully`
    })
    
})

router.get('/:cid', async (req,res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManagerDb.getCartProductById(cartId);
     

        if (cart !== 'Cart not found') {
            res.json(cart)
        }else {
            res.send({
                message: 'Cart not found'});
        }
        
    } catch (error) {
        console.log('Error:', error);
    }

})


router.post ('/', async (req,res)=> {
    const cart = await cartManagerDb.addNewCart();
    res.send({
        status: 'succes',
        msg: cart
    })
})

router.post('/:cid/product/:pid', async (req, res)=>{
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.params.quantity


    const cart = await cartManagerDb.addProductToCart(cid, pid, quantity);

    res.send ({
        status : 'sucess',
        msg: cart
    })
    
})

router.delete('/carts/:cid/products/:pid', async (req,res)=> {
    const { cid, pid } = req.params;

    try {
        const result = await cartManagerDb.deleteProductsInCart(cid, pid);
        res.json(result);
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.sedn({ 
            status: 'error', 
            msg: 'Internal Server Error'
         });
    }

})

router.put('/carts/:cid', async (req,res)=> {
    const { cid } = req.params;
    const { updatedProduct } = req.body;

    try {
        const result = await cartManagerDb.updatedCart(cid, updatedProduct);
        res.json(result);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.send({ 
            status: 'error', 
            msg: 'Internal Server Error' 
        });
    }
})

router.put('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const result = await cartManagerDb.updateProductQuantity(cid, pid, quantity);
        res.json(result);
    } catch (error) {
        console.error('Error updating product quantity in cart:', error);
        res.send({ 
            status: 'error', 
            msg: 'Internal Server Error' 
        });
    }
});

router.delete('/carts:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const result = await cartManagerDb.deleteAllProductsInCart(cid);
        res.json(result);
    } catch (error) {
        console.error('Error deleting all products from cart:', error);
        res.send({ 
            status: 'error', 
            msg: 'Internal Server Error' 
        });
    }
});
