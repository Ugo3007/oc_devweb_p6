import {Schema, model} from "mongoose";

const sauceSchema = new Schema ({
    description: {type: String, required: true},
    dislikes: {type: Number, required: true},
    heat: {type: Number, required: true},
    imageUrl: {type: String, required: true},
    likes: {type: Number, required: true},
    mainPepper: {type: String, required: true},
    manufacturer: {type: String, required: true},
    name: {type: String, required: true},
    userId: {type: String, required: true},
    usersDisliked: {type: Array, required:true},
    usersLiked: {type: Array, required:true},
})

export default model('Sauce', sauceSchema)