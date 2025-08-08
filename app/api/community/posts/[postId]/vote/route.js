import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { CommunityPost } from "../../../../../../models/CommunityPost";
import { User } from "../../../../../../models/User";
import dbConnect from "../../../../../../utils/dbConnect";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { postId } = params;
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
    
    // Find post
    const post = await CommunityPost.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Check if user already voted
    const hasUpvoted = post.votes.upvotes.some(vote => vote.user.toString() === user._id.toString());
    const hasDownvoted = post.votes.downvotes.some(vote => vote.user.toString() === user._id.toString());
    
    // Remove existing votes
    if (hasUpvoted) {
      post.votes.upvotes = post.votes.upvotes.filter(vote => vote.user.toString() !== user._id.toString());
    }
    if (hasDownvoted) {
      post.votes.downvotes = post.votes.downvotes.filter(vote => vote.user.toString() !== user._id.toString());
    }
    
    // Add new vote if it's different from existing or if no existing vote
    if (type === 'upvote' && !hasUpvoted) {
      post.votes.upvotes.push({ user: user._id });
    } else if (type === 'downvote' && !hasDownvoted) {
      post.votes.downvotes.push({ user: user._id });
    }
    
    await post.save();
    
    const voteScore = post.votes.upvotes.length - post.votes.downvotes.length;
    
    return NextResponse.json({
      message: 'Vote updated successfully',
      voteScore,
      userVote: hasUpvoted && type === 'upvote' ? null : (hasDownvoted && type === 'downvote' ? null : type)
    });
    
  } catch (error) {
    console.error('Error voting on post:', error);
    return NextResponse.json(
      { error: 'Failed to vote on post' },
      { status: 500 }
    );
  }
}
