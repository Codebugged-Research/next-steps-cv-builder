import { s3 } from '../middlewares/s3.upload.middleware.js';
import User from '../models/user.model.js';

export const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No photo uploaded'
            });
        }

        const photoUrl = req.file.location; 
        const photoKey = req.file.key;      

        res.status(200).json({
            success: true,
            data: {
                url: photoUrl,
                key: photoKey,
                message: 'Photo uploaded successfully'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProfilePhoto = async (req, res) => {
    try {
        const { photoKey } = req.params;

        const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: photoKey
        };

        await s3.deleteObject(deleteParams).promise();

        res.status(200).json({
            success: true,
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};