import express from "express";
import auth from "../middlewares/auth"
import multer from "../middlewares/multer-config";

import Sauce from "../models/Sauce.model"
import * as fs from "fs";

const router = express.Router()

router.get('/', auth, (req, res) => {
    Sauce.find()
        .then(sauces => {
            return res.status(200).json({sauces})
        })
        .catch(error => {
            return res.status(400).json({error})
        })
})

router.get('/:id', auth, (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            return res.status(200).json({sauce})
        })
        .catch(error => {
            return res.status(200).json({error})
        })
})

router.post('/', auth, multer, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.put('/:id', auth, multer, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.delete('/:id', auth, (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce !== null) {
                if (sauce.userId !== req.auth.userId) {
                    return res.status(401).json({message: 'Forbidden access'})
                } else {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    // TODO : changer
                    Sauce.deleteOne({_id: req.params._id})
                        .then(() => {
                            fs.unlink(`images/${filename}`, () => {
                            })
                            return res.status(200).json({message: 'Objet supprimé'})
                        })
                        .catch(error => res.status(401).json({error}))
                }
            } else {
                return res.status(400).json({message: 'Error: Sauce === null'})
            }
        })
        .catch((error) => {
            return res.status(400).json({error})
        })
})


router.post('/:id/like', auth, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

export default router