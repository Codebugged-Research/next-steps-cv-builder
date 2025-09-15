import { Conference } from '../models/conference.model.js';

export const createConference = async (req, res) => {
    try {
        const conference = await Conference.create(req.body);
        res.status(201).json({
            success: true,
            data: conference,
            message: "Conference created successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllConferences = async (req, res) => {
    try {
        const { category, isActive = true } = req.query;
        const filter = { isActive };
        
        if (category) {
            filter.category = category;
        }

        const conferences = await Conference.find(filter)
            .sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            data: conferences,
            count: conferences.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getConferenceById = async (req, res) => {
    try {
        const conference = await Conference.findById(req.params.id);
        
        if (!conference) {
            return res.status(404).json({
                success: false,
                message: "Conference not found"
            });
        }

        res.status(200).json({
            success: true,
            data: conference
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateConference = async (req, res) => {
    try {
        const conference = await Conference.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!conference) {
            return res.status(404).json({
                success: false,
                message: "Conference not found"
            });
        }

        res.status(200).json({
            success: true,
            data: conference,
            message: "Conference updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteConference = async (req, res) => {
    try {
        const conference = await Conference.findByIdAndDelete(req.params.id);

        if (!conference) {
            return res.status(404).json({
                success: false,
                message: "Conference not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Conference deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUpcomingConferences = async (req, res) => {
    try {
        const currentDate = new Date();
        const conferences = await Conference.find({
            startDate: { $gte: currentDate },
            isActive: true
        }).sort({ startDate: 1 }).limit(10);

        res.status(200).json({
            success: true,
            data: conferences,
            count: conferences.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};