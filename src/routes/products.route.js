import { Router } from 'express';
import ProductManagerDB from '../dao/dbManager/ProductManagerDB.js';

const router = Router();
const productManager = new ProductManagerDB();

router.get('/', async (req,res)=> {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const products = await productManager.getProducts( limit, page, sort, query );
        // res.render('products', { products: JSON.parse(JSON.stringify(products)) });
        res.send({products});

    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.send({ product });
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

    const result = await productManager.addProduct(newProduct);
    res.send({result});
})


export default router;

