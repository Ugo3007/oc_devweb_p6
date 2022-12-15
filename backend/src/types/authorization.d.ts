import {JwtPayload} from "jsonwebtoken";

export {}

declare global {
    namespace Express {
        export interface Request {
            auth: { userId : string }
        }
    }
    namespace JsonWebTokens {
        export interface JwtPayload {
            userId: string
        }
    }
}

