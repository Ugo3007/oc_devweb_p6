import {NextFunction, Request, Response} from "express";


export default (req : Request, res : Response, next : NextFunction) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }

    if (
        sauceObject.name !== '' && !!sauceObject.name &&
        sauceObject.manufacturer !== '' && !!sauceObject.manufacturer &&
        sauceObject.description !== '' && !!sauceObject.description &&
        sauceObject.manufacturer !== '' && !!sauceObject.manufacturer &&
        sauceObject.heat >= 1 && sauceObject.heat <= 10 &&
        sauceObject.userId !== '' && !!sauceObject.userId
    ) {
        next()
    } else {
        return res.status(400).json({message: "Bad arguments"})
    }
}