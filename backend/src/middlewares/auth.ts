import jwt, {JwtPayload} from "jsonwebtoken";
import {Request, Response, NextFunction} from 'express';

import Authorization from "../types/authorization"

export default (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization?.split(' ')[1] !== undefined) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload
            const userId: string = decodedToken.userId
            req.auth = {
                userId: userId
            }
            next()
        } catch (error) {
            return res.status(401).json({error: 'Forbidden Access'})
        }
    } else {
        return res.status(401).json({error: 'No Authorization Token'})
    }
}