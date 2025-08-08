import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { CommunityReply } from "../../../../../../models/CommunityReply";
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
    
    const { replyId } = params;
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find reply
    const reply = await CommunityReply.findById(replyId).populate('post');
    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }
    
    // Check if user is the author of the original post
    if (reply.post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Only the post author can accept replies' },
        { status: 403 }
      );
    }
    
    // Check if reply is already accepted
    if (reply.isAccepted) {
      return NextResponse.json(
        { error: 'Reply is already accepted' },
        { status: 400 }
      );
    }
    
    // Unaccept any previously accepted replies for this post
    await CommunityReply.updateMany(
      { post: reply.post._id, isAccepted: true },
      { isAccepted: false, acceptedAt: null }
    );
    
    // Accept this reply
    reply.isAccepted = true;
    reply.acceptedAt = new Date();
    await reply.save();
    
    // Mark post as resolved if it's a help request
    if (reply.post.category === 'help' || reply.post.category === 'question') {
      reply.post.isResolved = true;
      reply.post.resolvedAt = new Date();
      await reply.post.save();
    }
    
    return NextResponse.json({
      message: 'Reply accepted successfully',
      reply
    });
    
  } catch (error) {
    console.error('Error accepting reply:', error);
    return NextResponse.json(
      { error: 'Failed to accept reply' },
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
    const reply = await CommunityReply.findById(replyId).populate('post');
    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }
    
    // Check if user is the author of the original post
    if (reply.post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Only the post author can unaccept replies' },
        { status: 403 }
      );
    }
    
    // Check if reply is accepted
    if (!reply.isAccepted) {
      return NextResponse.json(
        { error: 'Reply is not accepted' },
        { status: 400 }
      );
    }
    
    // Unaccept the reply
    reply.isAccepted = false;
    reply.acceptedAt = null;
    await reply.save();
    
    // Mark post as unresolved
    reply.post.isResolved = false;
    reply.post.resolvedAt = null;
    await reply.post.save();
    
    return NextResponse.json({
      message: 'Reply acceptance removed successfully'
    });
    
  } catch (error) {
    console.error('Error unaccepting reply:', error);
    return NextResponse.json(
      { error: 'Failed to unaccept reply' },
      { status: 500 }
    );
  }
}
