import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  // System Settings
  siteName: {
    type: String,
    default: 'UPCODE',
    required: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  registrationEnabled: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  
  // Platform Features
  contestRegistrationEnabled: {
    type: Boolean,
    default: true
  },
  premiumFeaturesEnabled: {
    type: Boolean,
    default: true
  },
  communityFeaturesEnabled: {
    type: Boolean,
    default: true
  },
  
  // Limits and Restrictions
  maxSubmissionsPerDay: {
    type: Number,
    default: 100
  },
  maxProblemsPerContest: {
    type: Number,
    default: 10
  },
  maxContestDurationHours: {
    type: Number,
    default: 24
  },
  
  // Email Settings
  emailService: {
    type: String,
    enum: ['smtp', 'sendgrid', 'mailgun'],
    default: 'smtp'
  },
  fromEmail: {
    type: String,
    default: 'noreply@upcode.com'
  },
  
  // Security Settings
  passwordMinLength: {
    type: Number,
    default: 8
  },
  requireEmailVerification: {
    type: Boolean,
    default: true
  },
  enableTwoFactorAuth: {
    type: Boolean,
    default: false
  },
  
  // Content Settings
  problemSubmissionEnabled: {
    type: Boolean,
    default: true
  },
  publicLeaderboards: {
    type: Boolean,
    default: true
  },
  allowGuestAccess: {
    type: Boolean,
    default: true
  },
  
  // System Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true,
  collection: 'settings'
});

// Ensure only one settings document exists
SettingsSchema.pre('save', async function() {
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  
  // Remove other settings documents to maintain singleton
  await this.constructor.deleteMany({ _id: { $ne: this._id } });
});

export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
