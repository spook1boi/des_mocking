import mongoose from "mongoose"

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    description: { type: String, required: false},
    quantity: { type: Number, required: false},
    total: { type: Number, required: false}
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)