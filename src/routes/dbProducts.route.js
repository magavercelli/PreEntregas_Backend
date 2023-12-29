import { Router } from 'express';
import productModel from '../dao/models/product.model.js';

const router = Router();
// Get all products
router.get('/', async (req,res)=> {

    try {
        const data= await productModel.find();
        res.send({data});
        
    } catch (error) {
        res.status(400).send("Error" + error)
    }
})

router.post('/', async(req,res)=> {
    const {title, description, price,  thumbnail: [foto1, foto2], code, stock, status, category} = req.body;
    if(!title || !description || !price || !thumbnail || !code || !stock || !status || !stock){
        return res.status(400).send({error: 'Datos incompletos'});
    }

    let newProduct = {
        title, 
        description,
        price,
        thumbnail: [foto1, foto2],
        code,
        stock,
        status: true,
        category
    }

    const result = await productModel.create(newProduct)
    res.send({result});
})


export default productModel;

