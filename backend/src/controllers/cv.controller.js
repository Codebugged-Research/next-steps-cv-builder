import { CV } from "../models/cv.model.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createOrUpdateCV = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    const existingUserCV = await CV.findOne({ userId });
    if (existingUserCV) {
        const updatedCV = await CV.findOneAndUpdate({ userId }, { $set: req.body }, { new: true });
        return res.status(200).json(new ApiResponse(200, updatedCV, "CV updated successfully"));
    }
    else {
        const newCV = await CV.create(req.body);
        return res.status(201).json(new ApiResponse(201, newCV, "CV created successfully"));
    }
})

const getCV = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const cv = await CV.findOne({ userId }).populate("userId", "fullName email");

    if (!cv) {
        throw new ApiError(404, "CV not found for this user");
    }

    return res.status(200).json(
        new ApiResponse(200, cv, "CV retrieved successfully")
    );
});

const uploadGovCV = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    if (!req.file) {
        throw new ApiError(400, "Government CV file is required");
    }
    
    // File validation (GridFS middleware handles the actual storage)
    if (!req.file.gridfsId) {
        throw new ApiError(500, "File upload to GridFS failed");
    }
    
    const govCVData = {
        userId: userId,
        originalName: req.file.originalname,
        filename: req.file.gridfsFilename,
        fileId: req.file.gridfsId, // GridFS file ID
        size: req.file.size,
        uploadDate: new Date(),
        type: 'government',
        status: 'pending'
    };
    
    const existingGovCV = await CV.findOne({
        userId,
        'govCV.type': 'government'
    });
    
    if (existingGovCV) {
        const updatedCV = await CV.findOneAndUpdate(
            { userId },
            {
                $set: {
                    'govCV': govCVData,
                    lastModified: new Date()
                }
            },
            { new: true }
        );
        return res.status(200).json(new ApiResponse(200, updatedCV, "Government CV uploaded successfully"));
    } else {
        const existingCV = await CV.findOne({ userId });
        
        if (existingCV) {
            const updatedCV = await CV.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        govCV: govCVData,
                        lastModified: new Date()
                    }
                },
                { new: true }
            );
            return res.status(200).json(new ApiResponse(200, updatedCV, "Government CV uploaded successfully"));
        } else {
            const newCV = await CV.create({
                userId: userId,
                govCV: govCVData,
            });
            return res.status(201).json(new ApiResponse(201, newCV, "Government CV uploaded and record created successfully"));
        }
    }
});
export {
    createOrUpdateCV,
    getCV,
    uploadGovCV
}