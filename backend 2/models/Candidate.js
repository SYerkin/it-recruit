import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['new', 'interview', 'offer', 'hired', 'rejected'],
      default: 'new',
    },
    resume: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Candidate = mongoose.model('Candidate', candidateSchema);

