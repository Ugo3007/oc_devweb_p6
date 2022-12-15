import {Schema, model} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

userSchema.plugin(uniqueValidator)

module.exports = model('User', userSchema)