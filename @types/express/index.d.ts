
import express from "express-serve-static-core";
import mongoose from "mongoose";

type User = {
    email: string;
    company: string;
    token: string;
    company_id: mongoose.Types.ObjectId;
}

declare module 'express-serve-static-core' {
    interface Request {
        user: User
    }
}
