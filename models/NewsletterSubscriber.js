import mongoose from 'mongoose';

const NewsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    default: 'Newsletter Subscriber',
    trim: true,
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
  isActive: {
    type: Boolean,
    default: true,
  },
  subscriptionDate: {
    type: Date,
    default: Date.now,
  },
  lastEmailSent: {
    type: Date,
    default: null,
  },
  emailsSent: {
    type: Number,
    default: 0,
  },
});

// Create compound index for faster queries
NewsletterSubscriberSchema.index({ email: 1, isActive: 1 });

const NewsletterSubscriber = mongoose.models.NewsletterSubscriber || 
  mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);

export default NewsletterSubscriber;
