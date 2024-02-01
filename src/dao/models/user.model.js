import mongoose from "mongoose";

const usersCollection = 'Users';

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        // required: true
    },
    last_name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    age: Number,
    password:{
        type: String,
        // required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
})

const userModel = mongoose.model(usersCollection, schema);

export default userModel;