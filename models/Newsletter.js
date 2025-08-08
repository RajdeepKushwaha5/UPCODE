import { model, models, Schema } from "mongoose";

const NewsletterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  source: {
    type: String,
    default: 'website',
  },
  preferences: {
    contests: {
      type: Boolean,
      default: true,
    },
    tutorials: {
      type: Boolean,
      default: true,
    },
    news: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

export const Newsletter = models?.Newsletter || model('Newsletter', NewsletterSchema);
