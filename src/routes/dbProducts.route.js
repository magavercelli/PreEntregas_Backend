import { Router } from 'express';
import productModel from '../dao/models/product.model.js';
import ProductManagerDB from '../dao/dbManager/ProductManagerDB.js';
import products from '../products.js';

const router = Router();
const prod = new ProductManagerDB();
// Get all products
router.get('/initial', (req, res) => {
    res.send({ data: products });
});
router.get('/', async (req,res)=> {
    const products = await prod.getProducts();
    res.render('products', { products: products });
})

router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await prod.getProductById(productId);
    res.render('product', { product: product });
});

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

