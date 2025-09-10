import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    basicDetails: {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer-not-to-say'],
            default: ""
        },
        nationality: {
            type: String,
            default: ""
        },
        usmleId: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        medicalSchool: {
            type: String,
            required: true
        },
        graduationYear: {
            type: String,
            required: true
        },
        mbbsRegNo: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            required: true
        },
        photo: {
            type: String, // GridFS file ID for profile photo
            default: null
        },
        languages: [{
            language: {
                type: String,
                enum: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic', 'Portuguese', 'Russian', 'Japanese']
            },
            fluency: {
                type: String,
                enum: ['native', 'fluent', 'conversational', 'basic', 'beginner']
            }
        }]
    },
    education: {
        medicalSchoolName: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
        joiningDate: {
            type: String,
            default: ""
        },
        completionDate: {
            type: String,
            default: ""
        },
        firstYearPercentage: {
            type: String,
            default: ""
        },
        secondYearPercentage: {
            type: String,
            default: ""
        },
        preFinalYearPercentage: {
            type: String,
            default: ""
        },
        finalYearPercentage: {
            type: String,
            default: ""
        },
        hasResidency: {
            type: Boolean,
            default: false
        }
    },
    usmleScores: {
        step1Status: {
            type: String,
            enum: ['not-taken', 'pass', 'fail'],
            default: 'not-taken'
        },
        step2ckScore: {
            type: String,
            default: ""
        },
        ecfmgCertified: {
            type: Boolean,
            default: false
        }
    },
    clinicalExperiences: [{
        title: String,
        hospital: String,
        duration: String,
        description: String
    }],
    skills: {
        type: String,
        default: ""
    },
    professionalExperiences: [{
        position: String,
        organization: String,
        duration: String,
        description: String
    }],
    volunteerExperiences: [{
        organization: String,
        role: String,
        duration: String,
        description: String
    }],
    significantAchievements: {
        type: String,
        default: ""
    },
    publications: [{
        title: {
            type: String,
            required: true
        },
        journal: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['research-article', 'case-report'],
            default: 'research-article'
        }
    }],
    conferences: [{
        name: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        certificateAwarded: {
            type: Boolean,
            default: false
        }
    }],
    workshops: [{
        name: {
            type: String,
            required: true
        },
        organizer: {
            type: String,
            default: ""
        },
        year: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        awards: {
            type: String,
            default: ""
        },
        date: {
            type: String,
            default: ""
        }
    }],
    emrRcmTraining: {
        emrSystems: [{
            type: String
        }],
        rcmTraining: {
            type: Boolean,
            default: false
        },
        duration: {
            type: String,
            default: ""
        }
    },
    // Government CV upload section
    govCV: {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        originalName: { 
            type: String 
        },
        filename: { 
            type: String 
        },
        fileId: { 
            type: String // GridFS file ID
        },
        size: { 
            type: Number 
        },
        uploadDate: { 
            type: Date, 
            default: Date.now 
        },
        type: { 
            type: String, 
            default: 'government' 
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    isComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const CV = mongoose.model("CV", cvSchema);