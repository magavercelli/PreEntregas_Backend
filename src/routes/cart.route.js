import { Router } from 'express';
import CartManager from '../dao/managers/CartManager.js';

const path = 'carts.json';
const router = Router();
const cartManager = new CartManager(path);

router.post ('/', async (req,res) => {
    try {
        const newCart = await cartManager.addNewCart();
        res.json (newCart);
        
    } catch (error) {
        res.send({ error: 'error'});
        
    }

})
router.get('/:cid', async (req,res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartProductById(cartId);
     

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

router.post ('/:cid/products/:pid', async (req,res) => {
    const { cid, pid } = req.params;

    try {
        await cartManager.addProductToCart(cid, pid);
        res.send({
            status: 'success',
            message: 'add product to cart'
        })
    } catch (error) {
        console.log('error at trying to save the product in the cart');
        
    }

})

export {router as cartRoute};