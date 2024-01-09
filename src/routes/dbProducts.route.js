import { Router } from 'express';
import productModel from '../dao/models/product.model.js';
import ProductManagerDB from '../dao/dbManager/ProductManagerDB.js';

const router = Router();
const prod = new ProductManagerDB();

router.get('/', async (req,res)=> {
    try {
        const products = await prod.getProducts();
        res.render('products', { products: JSON.parse(JSON.stringify(products)) });

    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await prod.getProductById(productId);
    res.render('product', { product: JSON.parse(JSON.stringify(product)) });
});

router.post('/', async(req,res)=> {
    const {title, description, price,  thumbnail: [foto1, foto2], code, stock, status, category} = req.body;
    if(!title || !description || !price || !thumbnail || !code || !stock || !status || !stock){
        return res.status(400).send({error: 'Datos incompletos'});
    }

    let newProduct = {
        id,
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


export default router;

