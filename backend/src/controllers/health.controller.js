import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const healthCheck = asyncHandler(async (req, res) => {
    const healthData = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    };

    return res.status(200).json(
        new ApiResponse(200, healthData, "Health check successful")
    );
});

export { healthCheck };
