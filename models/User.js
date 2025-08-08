import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth users
  name: { type: String }, // Full name from OAuth
  image: { type: String }, // Profile image from OAuth
  provider: { type: String }, // 'google', 'github', or null for credentials
  providerId: { type: String }, // OAuth provider's user ID
  userInfo: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isAdmin: { type: Boolean, default: false },

  // Progress tracking fields
  totalXP: { type: Number, default: 0 },
  problemsSolved: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastSolvedDate: { type: Date },
  rank: { type: String, default: 'Unranked' },

  // Difficulty-wise progress
  easySolved: { type: Number, default: 0 },
  mediumSolved: { type: Number, default: 0 },
  hardSolved: { type: Number, default: 0 },

  // Preferences
  preferredLanguage: { type: String, default: 'javascript' },
  theme: { type: String, default: 'dark' },
  fontSize: { type: Number, default: 14 },

  // Premium features
  isPremium: { type: Boolean, default: false },
  premiumExpiry: { type: Date },
  subscription: {
    plan: { type: String, enum: ['Free', 'Premium'], default: 'Free' },
    billing: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false },
    paymentHistory: [{
      paymentId: { type: String },
      orderId: { type: String },
      amount: { type: Number },
      currency: { type: String, default: 'INR' },
      status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }]
  },

  // User interactions
  bookmarkedProblems: [{ type: String }], // Array of problem IDs
  problemNotes: {
    type: Map,
    of: String,
    default: new Map()
  } // Map of problemId -> notes text
}, { timestamps: true });


export const User = models?.User || model('User', UserSchema);