import { model, models, Schema } from "mongoose";

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['registration', 'password-reset'],
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const OTP = models?.OTP || model('OTP', OTPSchema);
