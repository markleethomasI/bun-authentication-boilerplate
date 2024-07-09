import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';

type JwtPayload = {
    email: String,
    company: String,
    company_id: mongoose.Types.ObjectId,
    role: 'admin' | 'user'
}
// This file includes functions to sign and verify json web tokens

const signJwt = (payload: JwtPayload) => {
    // Check for required fields
    const requiredFields = ['email', 'company', 'role', 'company_id'];

    // Filter for missing fields
    const missingFields = requiredFields.filter(field => !payload.hasOwnProperty(field));

    // Throw error for missing fields if missing
    if (missingFields.length > 0) {
        throw new Error(`missing fields ${missingFields}`)
    }

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default-secret-key')

    return token
}

const decodeToken = (token: string) => {
    // Decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')

    // Return decoded token
    return decodedToken
}

export {
    signJwt,
    decodeToken
}