import { Router } from 'express';
import Company from '../models/company.model.js';
import User from '../models/user.model.js'
import { saltAndHashPassword, comparePassword } from '../utils/paswordUtils.js';
import { signJwt } from '../utils/jwtUtils.js';
import authenticationMiddleware from '../middleware/authenticateToken.js';
import mongoose, { MongooseError } from 'mongoose';
import { isNamedExportBindings } from 'typescript';
import AppError from '../utils/AppError.js';

const router = Router()

router.use('/login', async (req, res) => {
    try {
        // Check for required fields
        const requiredFields = ['email', 'password'];

        // Filter for missing fields
        const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));

        // If missing fields send 400 response with missing required fields
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Check for password compare
        const isValid = await comparePassword(req.body.email, req.body.password)

        // If password is not valid then send email or password is invalid
        if (!isValid) {
            return res.status(403).json({ error: 'email or password invalid' })
        }

        // Find User
        const user = await User.findOne({ email: req.body.email }).exec()

        let jwt;

        if (user) {

            // Find Company
            const company = await Company.findOne({ _id: user.company })

            if (company) {
                // Sign JWT
                jwt = signJwt({
                    email: user.email,
                    company: company.name,
                    role: user.role,
                    company_id: user.company
                })

                user.tokens.push(jwt)

                await user.save()
            }


        }

        // Set cookie for token
        return res.status(200).cookie('token', jwt).json({ "status": "logged in", "token": jwt })

    } catch (e: any) {
        return res.status(500).json({ error: e.message })
    }
})

router.post('/create-company', async (req, res, next) => {
    try {

        // Check for required fields
        const requiredFields = ['username', 'email', 'password', 'company'];

        // Filter for missing fields
        const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));

        // If missing fields send 400 response with missing required fields
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Check for existing company
        const existingCompany = await Company.findOne({
            name: req.body.company
        })

        if (existingCompany) {
            return res.status(409).json({
                error: "company already exists"
            })
        }

        // Create new company
        const company = new Company({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.company
        })

        // Save company in DB
        await company.save()

        // Salt and Hash Pasword
        const saltedAndHashedPassword = await saltAndHashPassword(req.body.password)

        // Create new user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: saltedAndHashedPassword,
            company: company._id,
            role: "admin"
        })

        // Save user in DB
        await user.save()

        // Send 200 response with success as status 
        return res.status(200).json({
            status: "success"
        })

    } catch (e) {
        return res.status(500).json({
            error: e
        })
    }
});

// Protected Routes Begin

// Pass request through token authentication process
router.use(authenticationMiddleware.authenticateToken)

// Begin routes
router.post("/register-user", async (req, res, next) => {
    try {
    // Check for required fields in req.body
    const requiredFields = ['username', 'email', 'password', 'role'];

    // Filter for missing fields
    const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));

    // If missing fields send 400 response with missing required fields
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Hash Password
    const hashedPassword = await saltAndHashPassword(req.body.password)

    // create new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        company: req.user.company_id
    })

    // Save user
    await user.save()
    } catch(e: any) {
        if(e.code === 11000){
            next(new AppError('Username or email is taken', 400))
        } 
    }
})

router.post("/logout", async (req, res) => {
    // Load user from database
    const user = await User.findOne({ email: req.user.email })

    // Check if user found
    if (!user) {
        return res.status(400).json({
            "error": "user not found"
        })
    }

    // Check if token is valid
    const isValidToken = user.tokens.find((v) => {
        return v === req.user.token
    })

    // If token is not in database then send already logged out
    if (!isValidToken) {
        return res.status(400).json({
            "error": "user already logged out"
        })
    }

    // Filter out token
    const filteredTokens = user.tokens.filter((v) => {
        return v !== req.user.token
    })

    // Replace array on database entry with filtered token array
    user.tokens = filteredTokens;

    // Save user to database
    await user.save()

    // Return 200 response with logged out successfully
    return res.status(200).json({
        "status": "user logged out successfully"
    })

})
// Protected routes end

export default router