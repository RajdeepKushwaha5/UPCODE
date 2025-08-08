/**
 * Problem Model - LeetCode Style Database Schema
 * Complete schema for coding problems with organized structure
 */

import mongoose from 'mongoose';

// -----------------
// Sub-schemas
// -----------------

const TestCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const CodeTemplateSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'typescript', 'php']
  },
  code: {
    type: String,
    required: true
  }
});

const ExampleSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
});

const SolutionSchema = new mongoose.Schema({
  approach: {
    type: String,
    default: ''
  },
  complexity: {
    time: {
      type: String,
      default: 'O(n)'
    },
    space: {
      type: String,
      default: 'O(1)'
    }
  },
  code: {
    type: String,
    default: ''
  },
  explanation: {
    type: String,
    default: ''
  }
});

const EditorialSchema = new mongoose.Schema({
  content: {
    type: String,
    default: ''
  },
  isPremium: {
    type: Boolean,
    default: false
  }
});

const VideoSolutionSchema = new mongoose.Schema({
  url: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
});

const StatsSchema = new mongoose.Schema({
  totalSubmissions: {
    type: Number,
    default: 0
  },
  acceptedSubmissions: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
});

// -----------------
// Main Problem Schema
// -----------------

const ProblemSchema = new mongoose.Schema({
  
  // -----------------
  // Core Problem Info
  // -----------------
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  description: {
    type: String,
    required: true
  },
  
  // -----------------
  // Problem Details
  // -----------------
  examples: [ExampleSchema],
  constraints: [{
    type: String,
    trim: true
  }],
  hints: [{
    type: String,
    trim: true
  }],
  
  // -----------------
  // Classification & Metadata
  // -----------------
  tags: [{
    type: String,
    required: true
  }],
  companies: [{
    type: String,
    trim: true
  }],
  acceptanceRate: {
    type: Number,
    default: 50.0,
    min: 0,
    max: 100
  },
  frequency: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  
  // -----------------
  // Code Templates (per language)
  // -----------------
  codeTemplates: [CodeTemplateSchema],
  
  // -----------------
  // Test Cases
  // -----------------
  testCases: [TestCaseSchema],
  
  // -----------------
  // Solutions & Editorial
  // -----------------
  solution: SolutionSchema,
  editorial: EditorialSchema,
  videoSolution: VideoSolutionSchema,
  
  // -----------------
  // Relationships & Follow-ups
  // -----------------
  followUp: [{
    type: String,
    trim: true
  }],
  relatedProblems: [{
    type: Number
  }],
  
  // -----------------
  // Statistics & Tracking
  // -----------------
  stats: {
    type: StatsSchema,
    default: () => ({})
  }
  
  // -----------------
  // Audit Fields (handled by timestamps: true)
  // -----------------
  
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// -----------------
// Indexes for Performance
// -----------------
ProblemSchema.index({ id: 1 });
ProblemSchema.index({ slug: 1 });
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ tags: 1 });
ProblemSchema.index({ companies: 1 });
ProblemSchema.index({ isPremium: 1 });
ProblemSchema.index({ frequency: -1 });

// -----------------
// Virtual Fields
// -----------------
ProblemSchema.virtual('calculatedAcceptanceRate').get(function() {
  if (this.stats && this.stats.totalSubmissions > 0) {
    return Math.round((this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100);
  }
  return this.acceptanceRate;
});

// Ensure virtual fields are serialized
ProblemSchema.set('toJSON', {
  virtuals: true
});

const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);

export default Problem;
