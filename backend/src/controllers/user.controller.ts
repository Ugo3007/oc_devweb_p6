import express from "express";

const router = express.Router();

router.post('/signup', (req, res) => {
    return res.status(200).json({message: ''})
})

router.post('/login', (req, res) => {
    return res.status(200).json({message: ''})
})


export default router