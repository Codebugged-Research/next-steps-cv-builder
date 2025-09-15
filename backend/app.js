import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

import userRoutes from './src/routes/user.routes.js';
import cvRoutes from './src/routes/cv.routes.js';
import conferenceRoutes from './src/routes/conference.routes.js';

app.use('/api/users', userRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/conferences', conferenceRoutes);

export { app };