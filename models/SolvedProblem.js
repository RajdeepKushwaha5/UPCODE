import { model, models, Schema } from "mongoose";

const SolvedProblemSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    problemId: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    },
    contest: {
        type: Schema.Types.ObjectId,
        ref: 'Contest',
    },
    solvedAt: {
        type: Date,
        default: Date.now
    },
    lastSolvedAt: {
        type: Date,
        default: Date.now
    },
    xpEarned: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number, // in seconds
        default: 0
    },
    bestTime: {
        type: Number, // best time in seconds
        default: 0
    },
    attempts: {
        type: Number,
        default: 1
    },
    solution: [{
        code: {
            type: String,
            required: true
        },
        complexity: {
            type: [String],
            required: true
        },
        submissionTime: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        passedTestCases: { type: Number, required: true },
        executionTime: {
            type: Number // in milliseconds
        },
        memoryUsage: {
            type: Number // in MB
        }
    }],

    star: { type: Boolean }
}, {
    timestamps: true
});

// Compound index for efficient queries
SolvedProblemSchema.index({ userId: 1, problemId: 1 });
SolvedProblemSchema.index({ userId: 1, solvedAt: -1 });
SolvedProblemSchema.index({ difficulty: 1 });

// Submission.virtual('score', {
//   get() {
//     return this.passedTestCases * 100 / this.problem.testCases.length - this.executionTime / 1000;
//   },
// });

export const SolvedProblem = models?.SolvedProblem || model('SolvedProblem', SolvedProblemSchema);