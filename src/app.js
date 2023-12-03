import express from 'express';
import { productRoute } from './routes/product.route.js';
import { cartRoute } from './routes/cart.route.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})