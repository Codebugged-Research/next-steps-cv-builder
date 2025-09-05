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
        medicalSchool: {
            type: String,
            required: true
        },
        graduationYear: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
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
    }
}, {
    timestamps: true
});

export const CV = mongoose.model("CV", cvSchema);