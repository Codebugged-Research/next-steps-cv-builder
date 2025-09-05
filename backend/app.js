import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

import userRoutes from './src/routes/user.routes.js';
import cvRoutes from './src/routes/cv.routes.js';
app.use('/api/users', userRoutes);
app.use('/api/cv', cvRoutes);


export { app };