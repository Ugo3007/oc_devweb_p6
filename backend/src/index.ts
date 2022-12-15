import express from 'express'
import dotenv from "dotenv";
import mongoose from "mongoose";

import userController from "./controllers/user.controller"

const app = express()

dotenv.config();
dotenv.config({path: `.env.local`, override: true});

mongoose.connect('mongodb+srv://' + process.env.MONGOOSE_USERNAME + ':' + process.env.MONGOOSE_PASSWORD + process.env.MONGOOSE_DATABASE_ADDRESS)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/auth', userController)


app.listen(3000, () => {
    console.log("Connecté")
})