import mongoose from "mongoose";

const collection = "Users"

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    address: String,
    password: String,
    age: Number
})

export const users = mongoose.model(collection, UserSchema)