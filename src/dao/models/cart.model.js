import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema ({
    id : {
        type: String,
        required: true
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'

                }
            }
        ],
        default: []

    }
 
})

const cartsModel = mongoose.model(cartCollection, cartSchema);

export default cartsModel;