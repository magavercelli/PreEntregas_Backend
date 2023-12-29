import mongoose from 'mongoose';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    thumbnail: {
        // [foto1, foto2],
    },
    code: {
        type: Number,
        unique: true,
    },
    stock: {
        type: Number,
        default: 0
    },
    status: true,
    category: {
        type: String,
        require: true
    }
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;