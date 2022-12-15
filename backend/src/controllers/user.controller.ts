import express from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

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
    User.findOne({email: req.body.email})
        .then(user => {
            if (user === null) {
                res.status(401).json({message: 'Invalid credentials'})
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((valid: boolean) => {
                        if (!valid) {
                            res.status(401).json({message: 'Invalid credentials'})
                        } else {
                            res.status(200).json({userId: user._id, token: jwt.sign(
                                    {userId: user._id},
                                    process.env.JWT_SECRET_KEY as string,
                                    {expiresIn: '24h'}
                                )})
                        }
                    })
                    .catch((error: any) => {
                        res.status(500).json({error})
                    })
            }
        })
        .catch(error => res.status(500).json({error}));
})

export default router