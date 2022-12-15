import express from "express";
import bcrypt from "bcrypt";

import User from "../models/User.model"

const router = express.Router();

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash: string) => {
            const user = new User({
                email : req.body.email,
                password: hash
            })
            user.save()
                .then(() => {
                    return res.status(201).json({message: 'Utilisateur créé !'})
                })
                .catch(error => {
                    res.status(400).json({error})
                })
        })
        .catch((error: any) => {
            return res.status(500).json({error})
        })
})

router.post('/login', (req, res) => {
    return res.status(200).json({message: ''})
})


export default router