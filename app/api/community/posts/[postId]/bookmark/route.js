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
    
    // Check if user already bookmarked this post
    const isBookmarked = post.bookmarks.some(bookmark => bookmark.user.toString() === user._id.toString());
    
    if (isBookmarked) {
      // Remove bookmark
      post.bookmarks = post.bookmarks.filter(bookmark => bookmark.user.toString() !== user._id.toString());
    } else {
      // Add bookmark
      post.bookmarks.push({ user: user._id });
    }
    
    await post.save();
    
    return NextResponse.json({
      message: isBookmarked ? 'Bookmark removed' : 'Post bookmarked',
      isBookmarked: !isBookmarked
    });
    
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
}
