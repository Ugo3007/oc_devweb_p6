import express from "express";
import auth from "../middlewares/auth"
import multer from "../middlewares/multer-config";

const router = express.Router()

router.get('/', auth, (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
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