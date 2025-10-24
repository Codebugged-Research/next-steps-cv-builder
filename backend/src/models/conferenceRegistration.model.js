import mongoose from "mongoose";

const conferenceRegistrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['registered', 'cancelled', 'attended'],
        default: 'registered'
    }
}, {
    timestamps: true
});

conferenceRegistrationSchema.index({ user: 1, conference: 1 }, { unique: true });

export const ConferenceRegistration = mongoose.model('ConferenceRegistration', conferenceRegistrationSchema);