import express from "express";

const router = express.Router()

router.get('/', (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.get('/:id', (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.post('/', (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.put('/:id', (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.delete('/:id', (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

router.post('/:id/like', (req, res) => {
    return res.status(200).json({message: "Route not implemented"})
})

export default router