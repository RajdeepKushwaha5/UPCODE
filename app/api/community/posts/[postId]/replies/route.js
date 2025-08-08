import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { CommunityReply } from "../../../../../../models/CommunityReply";
import { CommunityPost } from "../../../../../../models/CommunityPost";
import { User } from "../../../../../../models/User";
import dbConnect from "../../../../../../utils/dbConnect";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const { postId } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sort = searchParams.get('sort') || 'newest';
    
    // Check if post exists
    const post = await CommunityPost.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    let sortQuery = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'votes':
        sortQuery = { voteScore: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortQuery = { createdAt: -1 };
        break;
    }
    
    // Get top-level replies for this post
    const replies = await CommunityReply.find({ post: postId, parentReply: null })
      .populate('author', 'name image')
      .populate({
        path: 'childReplies',
        populate: {
          path: 'author',
          select: 'name image'
        }
      })
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    const totalReplies = await CommunityReply.countDocuments({ post: postId, parentReply: null });
    
    return NextResponse.json({
      replies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReplies / limit),
        totalReplies,
        hasNext: page < Math.ceil(totalReplies / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { postId } = params;
    const { content, parentReplyId } = await req.json();
    
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
    
    // Check if post exists
    const post = await CommunityPost.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // If parentReplyId is provided, check if it exists
    let parentReply = null;
    if (parentReplyId) {
      parentReply = await CommunityReply.findById(parentReplyId);
      if (!parentReply) {
        return NextResponse.json(
          { error: 'Parent reply not found' },
          { status: 404 }
        );
      }
      
      // Prevent nesting beyond 3 levels
      if (parentReply.depth >= 3) {
        return NextResponse.json(
          { error: 'Maximum reply depth reached' },
          { status: 400 }
        );
      }
    }
    
    // Create reply
    const newReply = new CommunityReply({
      content,
      author: user._id,
      post: postId,
      parentReply: parentReplyId || null,
      depth: parentReply ? parentReply.depth + 1 : 0
    });
    
    await newReply.save();
    
    // Update parent reply's childReplies if it's a nested reply
    if (parentReply) {
      parentReply.childReplies.push(newReply._id);
      await parentReply.save();
    }
    
    // Update post's reply count
    post.stats.replyCount += 1;
    await post.save();
    
    // Populate author information
    await newReply.populate('author', 'name image');
    
    return NextResponse.json({
      message: 'Reply created successfully',
      reply: newReply
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}
