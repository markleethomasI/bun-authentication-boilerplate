import { type Response, type Request, type NextFunction } from 'express'
import type AppError from '../utils/AppError'

// Error Handler For Development Environment
const devError = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };

  //Error Handler For Production Environment
const prodError = (err: AppError, res: Response) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "something went very wrong!",
      });
    }
  };

  //Global Error Handler
const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined) {
      devError(err, res);
    } else if (process.env.NODE_ENV === "production") {
      prodError(err, res);
    }
  };
  export default globalErrorHandler;