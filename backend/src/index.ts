import express from 'express'
import dotenv from "dotenv";
import mongoose from "mongoose";

import userController from "./controllers/user.controller"
import sauceController from "./controllers/sauce.controller"
import path from "path";

const app = express()
app.use(express.json())

dotenv.config();
dotenv.config({path: `.env.local`, override: true});

mongoose.connect('mongodb+srv://' + process.env.MONGOOSE_USERNAME + ':' + process.env.MONGOOSE_PASSWORD + process.env.MONGOOSE_DATABASE_ADDRESS)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userController)
app.use('/api/sauces', sauceController)
app.use('/src/images', express.static(path.join(__dirname, './images')))

app.listen(3000, () => {
    console.log("Connecté")
})