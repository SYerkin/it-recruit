import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    salary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    profession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profession',
      required: true,
    },
    technologies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technology',
    }],
    experience: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
      },
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
      default: 'full-time',
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'archived'],
      default: 'draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Индексы
jobSchema.index({ profession: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdBy: 1 });

export const Job = mongoose.model('Job', jobSchema);

