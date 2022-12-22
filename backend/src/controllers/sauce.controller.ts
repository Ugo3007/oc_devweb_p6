import express from "express";
import auth from "../middlewares/auth"
import multer from "../middlewares/multer-config";

import Sauce from "../models/Sauce.model"
import * as fs from "fs";

const router = express.Router()

router.get('/', auth, (req, res) => {
    Sauce.find()
        .then(sauces => {
            return res.status(200).json(sauces)
        })
        .catch(error => {
            return res.status(400).json({error})
        })
})

router.get('/:id', auth, (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            return res.status(200).json(sauce)
        })
        .catch(error => {
            return res.status(200).json({error})
        })
})

router.post('/', auth, multer, (req, res) => {
        const sauceObject = JSON.parse(req.body.sauce)
        delete sauceObject.userId
        const sauce = new Sauce({
            ...sauceObject,
            dislikes: 0,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file?.filename}`,
            likes: 0,
            userId: req.auth.userId,
            usersDisliked: [],
            usersLiked: [],
        })
        sauce.save()
            .then(() => res.status(201).json({message: "Objet enregistré"}))
            .catch((error) => res.status(400).json({error}))
    }
)

router.put('/:id', auth, multer, (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }

    delete sauceObject.userId
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce === null) return res.status(404).json({message: 'Sauce not found'})
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({message: 'Forbidden access'})
            } else {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet modifié !'}))
                    .catch(error => {
                        return res.status(400).json({error})
                    });
            }
        })
        .catch((error) => {
            return res.status(400).json({error})
        })
})

router.delete('/:id', auth, (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce !== null) {
                if (sauce.userId !== req.auth.userId) {
                    return res.status(401).json({message: 'Forbidden access'})
                } else {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.deleteOne({_id: req.params.id})
                            .then(() => {
                                return res.status(204).json({message: "Objet supprimé."})
                            })
                        .catch(error => res.status(401).json({error}))
                    })
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