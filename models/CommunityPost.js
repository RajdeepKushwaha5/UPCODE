import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const CommunityPostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  category: {
    type: String,
    enum: ['discussion', 'help', 'showcase', 'news', 'tutorial', 'feedback'],
    default: 'discussion'
  },
  images: [{
    url: String,
    alt: String,
    filename: String
  }],
  votes: {
    upvotes: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }],
    downvotes: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'CommunityReply'
  }],
  views: {
    type: Number,
    default: 0
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  acceptedReply: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityReply'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  stats: {
    viewCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 }
  },
  bookmarks: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  resolvedAt: Date
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for vote score
CommunityPostSchema.virtual('voteScore').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Virtual for reply count
CommunityPostSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Indexes for better query performance
CommunityPostSchema.index({ category: 1, createdAt: -1 });
CommunityPostSchema.index({ tags: 1 });
CommunityPostSchema.index({ author: 1 });
CommunityPostSchema.index({ 'votes.upvotes.user': 1 });
CommunityPostSchema.index({ 'votes.downvotes.user': 1 });

export const CommunityPost = models?.CommunityPost || model('CommunityPost', CommunityPostSchema);
