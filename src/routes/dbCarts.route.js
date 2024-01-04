import {Router} from 'mongoose';
import productManagerDB from "../dao/dbManager/ProductManagerDB.js";
import CartManagerDB from '../dao/dbManager/CartManagerDB.js';

const router = Router();

const cartManagerDb= new CartManagerDB();

router.get('/', async (req, res)=> {
    const products = await productManagerDB.findAllProducts();
    return res.status(200).json({products: products});
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

    const cart = await cartManagerDb.addProductToCart();
    
})