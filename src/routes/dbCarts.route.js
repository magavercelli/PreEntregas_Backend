import {Router} from 'mongoose';
import productManagerDB from "../dao/dbManager/ProductManagerDB.js";
import CartManagerDB from '../dao/dbManager/CartManagerDB.js';

const router = Router();

const cartManagerDb= new CartManagerDB();

router.get('/', async ()=> {
    const products = await productManagerDB.findAllProducts() ;
})