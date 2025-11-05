import mongoose from 'mongoose';

const publicationProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  currentStage: {
    type: Number,
    required: true,
    default: 0 // Stage 0 to start
  },
  teamSize: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'pending', 'cancelled'],
    default: 'in-progress'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  pdf: {
    url: {
      type: String 
    },
    key: {
      type: String
    },
    uploadedAt: {
      type: Date
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

publicationProjectSchema.index({ user: 1 });
publicationProjectSchema.index({ status: 1 });

export const PublicationProject = mongoose.model('PublicationProject', publicationProjectSchema);
