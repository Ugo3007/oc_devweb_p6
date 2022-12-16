import express from "express";
import auth from "../middlewares/auth"
import multer from "../middlewares/multer-config";
import Sauce from "../models/Sauce.model";

const router = express.Router()

router.get('/', auth, (req, res) => {
    Sauce.find()
        .then(sauces => {
            return res.status(200).json({sauces})
        })
        .catch(error => {
            // return res.status(400).json({error})
        })
})

router.get('/:id', auth, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.post('/', auth, multer, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.put('/:id', auth, multer, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.delete('/:id', auth, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.post('/:id/like', auth, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

export default router