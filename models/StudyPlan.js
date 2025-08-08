import mongoose from 'mongoose';

const { model, models, Schema } = mongoose;

// Study Plan Schema
const StudyPlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },

  // Plan Configuration
  goal: {
    type: { type: String, enum: ['interview', 'contest', 'skill_improvement', 'certification'], required: true },
    company: { type: String }, // e.g., "Google", "Amazon"
    timeline: { type: Number, required: true }, // days
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' }
  },

  // User Preferences
  timeAvailability: {
    hoursPerDay: { type: Number, required: true },
    daysPerWeek: { type: Number, default: 7 },
    preferredTime: { type: String, enum: ['morning', 'afternoon', 'evening', 'flexible'], default: 'flexible' }
  },

  // AI Generated Content
  topics: [{
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "Arrays", "Dynamic Programming"
    order: { type: Number, required: true },
    estimatedDays: { type: Number, required: true },
    problems: [{
      problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
      difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
      priority: { type: Number, default: 1 },
      estimatedTime: { type: Number }, // minutes
      isCompleted: { type: Boolean, default: false },
      completedAt: { type: Date },
      attempts: { type: Number, default: 0 },
      lastAttemptAt: { type: Date }
    }],
    resources: [{
      type: { type: String, enum: ['video', 'article', 'documentation', 'tutorial'] },
      title: { type: String, required: true },
      url: { type: String, required: true },
      description: { type: String },
      isCompleted: { type: Boolean, default: false }
    }],
    quiz: {
      questions: [{
        question: { type: String },
        options: [{ type: String }],
        correctAnswer: { type: Number },
        explanation: { type: String }
      }],
      isCompleted: { type: Boolean, default: false },
      score: { type: Number }
    },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date }
  }],

  // Progress Tracking
  progress: {
    currentWeek: { type: Number, default: 1 },
    currentDay: { type: Number, default: 1 },
    totalProblemsAssigned: { type: Number, default: 0 },
    problemsCompleted: { type: Number, default: 0 },
    topicsCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    weeklyGoals: [{
      week: { type: Number },
      problemsTarget: { type: Number },
      problemsCompleted: { type: Number },
      topicsTarget: [{ type: String }],
      topicsCompleted: [{ type: String }],
      isCompleted: { type: Boolean, default: false }
    }],
    lastActiveDate: { type: Date, default: Date.now }
  },

  // Adaptation & AI Insights
  aiInsights: {
    strongAreas: [{ type: String }],
    weakAreas: [{ type: String }],
    recommendedFocus: { type: String },
    adaptationHistory: [{
      date: { type: Date, default: Date.now },
      reason: { type: String },
      changes: { type: String },
      aiReasoning: { type: String }
    }],
    nextRecommendations: [{ type: String }]
  },

  // Achievements & Milestones
  achievements: [{
    type: { type: String, enum: ['streak', 'completion', 'speed', 'accuracy', 'topic_mastery'] },
    title: { type: String },
    description: { type: String },
    earnedAt: { type: Date, default: Date.now },
    icon: { type: String }
  }],

  // Plan Status
  status: { type: String, enum: ['active', 'paused', 'completed', 'cancelled'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  completedAt: { type: Date },

  // Premium Features
  isPremiumPlan: { type: Boolean, default: false },
  aiPersonalization: { type: Boolean, default: false },
  mockInterviews: [{
    scheduledFor: { type: Date },
    completed: { type: Boolean, default: false },
    score: { type: Number },
    feedback: { type: String },
    areas: [{ type: String }]
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for completion percentage
StudyPlanSchema.virtual('completionPercentage').get(function () {
  if (this.progress.totalProblemsAssigned === 0) return 0;
  return Math.round((this.progress.problemsCompleted / this.progress.totalProblemsAssigned) * 100);
});

// Virtual for estimated completion date
StudyPlanSchema.virtual('estimatedCompletionDate').get(function () {
  const start = new Date(this.startDate);
  start.setDate(start.getDate() + this.goal.timeline);
  return start;
});

// Indexes for performance
StudyPlanSchema.index({ userId: 1, status: 1 });
StudyPlanSchema.index({ 'progress.lastActiveDate': 1 });
StudyPlanSchema.index({ startDate: 1 });

export const StudyPlan = models?.StudyPlan || model('StudyPlan', StudyPlanSchema);
