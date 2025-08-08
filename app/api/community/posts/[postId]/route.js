import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { CommunityPost } from "../../../../../models/CommunityPost";
import { CommunityReply } from "../../../../../models/CommunityReply";
import { User } from "../../../../../models/User";
import dbConnect from "../../../../../utils/dbConnect";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const { postId } = params;
    
    // Find and populate the post
    const post = await CommunityPost.findById(postId)
      .populate('author', 'name email image')
      .lean();
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Increment view count
    await CommunityPost.findByIdAndUpdate(postId, { $inc: { 'stats.viewCount': 1 } });
    
    return NextResponse.json({ post });
    
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
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
    
    const { postId } = params;
    const { title, content, category, tags, difficulty } = await req.json();
    
    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be less than 200 characters' },
        { status: 400 }
      );
    }
    
    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Content must be less than 5000 characters' },
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
    
    // Check if user is the author
    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'You can only edit your own posts' },
        { status: 403 }
      );
    }
    
    // Update post
    const updatedPost = await CommunityPost.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        category,
        tags: Array.isArray(tags) ? tags : [],
        difficulty
      },
      { new: true }
    ).populate('author', 'name email image');
    
    return NextResponse.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
    
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
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
    
    const { postId } = params;
    
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
    
    // Check if user is the author
    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'You can only delete your own posts' },
        { status: 403 }
      );
    }
    
    // Delete all replies associated with this post
    await CommunityReply.deleteMany({ post: postId });
    
    // Delete the post
    await CommunityPost.findByIdAndDelete(postId);
    
    return NextResponse.json({
      message: 'Post and all associated replies deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
