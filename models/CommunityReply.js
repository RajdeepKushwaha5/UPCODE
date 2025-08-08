import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const CommunityReplySchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1500
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
  parentReply: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityReply'
  },
  childReplies: [{
    type: Schema.Types.ObjectId,
    ref: 'CommunityReply'
  }],
  isAccepted: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for vote score
CommunityReplySchema.virtual('voteScore').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Indexes for better query performance
CommunityReplySchema.index({ post: 1, createdAt: 1 });
CommunityReplySchema.index({ author: 1 });
CommunityReplySchema.index({ parentReply: 1 });
CommunityReplySchema.index({ 'votes.upvotes.user': 1 });
CommunityReplySchema.index({ 'votes.downvotes.user': 1 });

export const CommunityReply = models?.CommunityReply || model('CommunityReply', CommunityReplySchema);
