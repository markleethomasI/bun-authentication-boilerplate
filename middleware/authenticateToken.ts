import express, { type Request, type Response, type NextFunction } from 'express'
import { decodeToken } from '../utils/jwtUtils';
import type { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model'


const authenticationMiddleware = {
    async authenticateToken(req: Request, res: Response, next: NextFunction) {
        // Check for token in cookies or sent in body
        if (!req.cookies.token && !req.body.token) {
            return res.status(400).json({ error: 'Token not found' });
        }

        // Token is found assign to variable
        const token = req.cookies.token || req.body.token

        // Decode token
        const decodedToken = decodeToken(token) as JwtPayload;

        // Get user email address
        const userEmail = decodedToken.email

        // Get user from database with token
        const user = await User.findOne({ email: userEmail }).exec();

        // Check if user found
        if (!user) {
            return res.status(400).json({ "error": "user not found" })
        }

        // See if token is still in user.tokens
        const isValidToken = user.tokens.find((userToken) => { return userToken === token })

        // If token is not valid then send not logged in error message
        if (!isValidToken) {
            return res.status(400).json({ "error": "user not logged in" })
        }

        // Assign decoded token values to req object
        req.user = {
            company: decodedToken.company,
            email: decodedToken.email,
            token: token,
            company_id: decodedToken.company_id
        }

        next();
    }
}

export default authenticationMiddleware