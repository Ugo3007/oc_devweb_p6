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
            .then(() => {
                return res.status(201).json({message: "Objet enregistré"})
            })
            .catch((error) => {
                return res.status(400).json({error})
            })
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
                    .then(() => {
                        if (req.file) {
                            const filename = sauce.imageUrl.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => {
                                console.log('Picture successfully deleted')
                            })
                        }
                        res.status(200).json({message: 'Objet modifié !'})
                    })
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
    const userId = req.body.userId
    const like = req.body.like
    const sauceId = req.params.id

    Sauce.findOne({_id: sauceId})
        .then((sauce) => {
            if (sauce !== null) {
                switch (like) {
                    case 1:
                        if (sauce.usersLiked.includes(userId)) {
                            return res.status(409).json({message: 'User has already liked the sauce'})
                        }
                        sauce.usersLiked.push(userId)
                        sauce.likes = sauce.usersLiked.length
                        break
                    case 0:
                        if (sauce.usersLiked.includes(userId)) {
                            sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1)
                            sauce.likes = sauce.usersLiked.length
                        }
                        if (sauce.usersDisliked.includes(userId)) {
                            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1)
                            sauce.dislikes = sauce.usersDisliked.length
                        }
                        break
                    case -1:
                        if (sauce.usersDisliked.includes(userId)) {
                            return res.status(409).json({message: 'User has already liked the sauce'})
                        }
                        sauce.usersDisliked.push(userId)
                        sauce.dislikes = sauce.usersDisliked.length
                        break
                    default:
                        res.status(406).json({message: 'like is not equal to 1, 0 or -1'})
                        break
                }
                Sauce.updateOne({_id: req.params.id}, sauce)
                    .then(() => {
                        return res.status(200).json({message: 'Objet modifié !'})
                    })
                    .catch(error => {
                        return res.status(400).json({error})
                    });
            }
        })
        .catch((error) => {
            res.status(400).json({error: error})
        })
})

export default router