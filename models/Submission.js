import mongoose from "mongoose";
const { model, models, Schema } = mongoose;

const SubmissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  problemSlug: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error', 'Pending'],
    required: true
  },
  runtime: {
    type: Number
  },
  memory: {
    type: Number
  },
  passedTestCases: {
    type: Number
  },
  totalTestCases: {
    type: Number
  },
  logs: {
    type: String
  },
  notes: {
    type: String // User notes about the submission
  },
  executionTime: {
    type: Number // Execution time in milliseconds
  },
  memoryUsage: {
    type: Number // Memory usage in KB
  },
  passedTests: {
    type: Number,
    default: 0
  },
  totalTests: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // Time spent on problem in seconds
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
SubmissionSchema.index({ userId: 1, problemId: 1, submittedAt: -1 });
SubmissionSchema.index({ userId: 1, status: 1 });
SubmissionSchema.index({ problemId: 1, status: 1 });

export const Submission = models?.Submission || model('Submission', SubmissionSchema);
export default Submission;
