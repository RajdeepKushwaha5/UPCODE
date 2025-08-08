import { model, models, Schema } from "mongoose";

const UserInfoSchema = new Schema({
  name: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  college: { type: String },
  city: { type: String },
  country: { type: String },
  phone: { type: String },
  admin: { type: Boolean, default: false },
  coursesEnrolled: [{ type: Schema.Types.ObjectId, ref: 'Course', default: [] }],
  solved: [{ type: Schema.Types.ObjectId, ref: 'SolvedProblem', default: [] }],
  contestPart: [{ type: Schema.Types.ObjectId, ref: 'Contest', default: [], problemSolved: [{ type: Schema.Types.ObjectId, ref: 'SolvedProblem', default: [] }] }],
  peerVideo: [{ type: Schema.Types.ObjectId, ref: 'peerVideo', default: [] }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'peerVideoReview', default: [] }],
  rating: { type: Number, default: 50 },
  assigned: [{ type: Schema.Types.ObjectId, ref: 'Queue', default: [], }],
  assignedTime: [{ type: Date, default: [], }],
  amount: { type: Number, default: 0 },
  // New profile fields
  petEmoji: { type: String, default: "🐱" },
  streakDays: { type: Number, default: 0 },
  currentRating: { type: Number, default: 800 },
  weeklyGoal: { type: Number, default: 5 },
  completedToday: { type: Number, default: 0 },
  strongAreas: [{ type: String, default: [] }],
  weakAreas: [{ type: String, default: [] }],
  badges: [{
    name: String,
    icon: String,
    description: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  isPremium: { type: Boolean, default: false },
  problemsSolved: {
    total: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 }
  }

}, { timestamps: true });

export const UserInfo = models?.UserInfo || model('UserInfo', UserInfoSchema);