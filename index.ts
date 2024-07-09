import express from 'express'
import routes from './routes/index.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import './utils/connectDb.js'
import AppError from './utils/AppError'
import globalErrorHandler from './controllers/ErrorController.js'

const app = express();

// Load middleware
app.use(express.json())

app.use(cookieParser())

// Load routes
app.use(routes)

// Handle 404 errors
app.all("*", (req, res, next) => {
    next(new AppError(`This path ${req.originalUrl} isn't on this server!`, 404))
})

// User global error handler
app.use(globalErrorHandler)

// Start app
app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
);