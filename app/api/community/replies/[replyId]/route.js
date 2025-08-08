import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { CommunityReply } from "../../../../../models/CommunityReply";
import { User } from "../../../../../models/User";
import dbConnect from "../../../../../utils/dbConnect";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { replyId } = params;
    const { type } = await req.json(); // 'upvote' or 'downvote'
    
    if (!['upvote', 'downvote'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find reply
    const reply = await CommunityReply.findById(replyId);
    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }
    
    // Check if user already voted
    const hasUpvoted = reply.votes.upvotes.some(vote => vote.user.toString() === user._id.toString());
    const hasDownvoted = reply.votes.downvotes.some(vote => vote.user.toString() === user._id.toString());
    
    // Remove existing votes
    if (hasUpvoted) {
      reply.votes.upvotes = reply.votes.upvotes.filter(vote => vote.user.toString() !== user._id.toString());
    }
    if (hasDownvoted) {
      reply.votes.downvotes = reply.votes.downvotes.filter(vote => vote.user.toString() !== user._id.toString());
    }
    
    // Add new vote if it's different from existing or if no existing vote
    if (type === 'upvote' && !hasUpvoted) {
      reply.votes.upvotes.push({ user: user._id });
    } else if (type === 'downvote' && !hasDownvoted) {
      reply.votes.downvotes.push({ user: user._id });
    }
    
    await reply.save();
    
    const voteScore = reply.votes.upvotes.length - reply.votes.downvotes.length;
    
    return NextResponse.json({
      message: 'Vote updated successfully',
      voteScore,
      userVote: hasUpvoted && type === 'upvote' ? null : (hasDownvoted && type === 'downvote' ? null : type)
    });
    
  } catch (error) {
    console.error('Error voting on reply:', error);
    return NextResponse.json(
      { error: 'Failed to vote on reply' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { replyId } = params;
    const { content } = await req.json();
    
    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reply content is required' },
        { status: 400 }
      );
    }
    
    if (content.length > 10000) {
      return NextResponse.json(
        { error: 'Reply content must be less than 10,000 characters' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find reply
    const reply = await CommunityReply.findById(replyId);
    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }
    
    // Check if user is the author
    if (reply.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'You can only edit your own replies' },
        { status: 403 }
      );
    }
    
    // Save current content to edit history
    reply.editHistory.push({
      content: reply.content,
      editedAt: new Date()
    });
    
    // Update content
    reply.content = content;
    reply.isEdited = true;
    reply.lastEditedAt = new Date();
    
    await reply.save();
    
    return NextResponse.json({
      message: 'Reply updated successfully',
      reply
    });
    
  } catch (error) {
    console.error('Error updating reply:', error);
    return NextResponse.json(
      { error: 'Failed to update reply' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { replyId } = params;
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find reply
    const reply = await CommunityReply.findById(replyId);
    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }
    
    // Check if user is the author
    if (reply.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'You can only delete your own replies' },
        { status: 403 }
      );
    }
    
    // Mark as deleted instead of actually deleting
    reply.isDeleted = true;
    reply.content = '[This reply has been deleted]';
    reply.deletedAt = new Date();
    
    await reply.save();
    
    return NextResponse.json({
      message: 'Reply deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json(
      { error: 'Failed to delete reply' },
      { status: 500 }
    );
  }
}
