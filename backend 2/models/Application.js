import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interview', 'offer', 'accepted', 'rejected'],
      default: 'pending',
    },
    coverLetter: {
      type: String,
    },
    resume: {
      type: String,
    },
    notes: {
      type: String,
    },
    // Заметки HR
    hrNotes: {
      type: String,
    },
    // Оценки кандидата
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Индексы
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ candidate: 1 });
applicationSchema.index({ status: 1 });

export const Application = mongoose.model('Application', applicationSchema);

