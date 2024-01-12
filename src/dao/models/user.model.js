import mongoose from "mongoose";

const usersCollection = 'Users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String
})

const userModal = mongoose.model(usersCollection, schema);

export default userModal;