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

export {
    createOrUpdateCV,
    getCV
}