import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { CommunityPost } from "../../../../models/CommunityPost";
import { CommunityReply } from "../../../../models/CommunityReply";
import { User } from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'recent'; // recent, popular, votes
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    
    let query = {};
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'popular':
        sortOptions = { views: -1, createdAt: -1 };
        break;
      case 'votes':
        // We'll sort by vote score in aggregation
        break;
      case 'recent':
      default:
        sortOptions = { isPinned: -1, createdAt: -1 };
        break;
    }
    
    const skip = (page - 1) * limit;
    
    let posts;
    
    if (sortBy === 'votes') {
      // Use aggregation for vote-based sorting
      posts = await CommunityPost.aggregate([
        { $match: query },
        {
          $addFields: {
            voteScore: {
              $subtract: [
                { $size: "$votes.upvotes" },
                { $size: "$votes.downvotes" }
              ]
            }
          }
        },
        { $sort: { isPinned: -1, voteScore: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author'
          }
        },
        { $unwind: '$author' },
        {
          $project: {
            'author.password': 0,
            'author.resetPasswordToken': 0,
            'author.resetPasswordExpires': 0
          }
        }
      ]);
    } else {
      posts = await CommunityPost.find(query)
        .populate('author', '-password -resetPasswordToken -resetPasswordExpires')
        .populate('acceptedReply')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Add vote score to each post
      posts = posts.map(post => ({
        ...post,
        voteScore: post.votes.upvotes.length - post.votes.downvotes.length,
        replyCount: post.replies.length
      }));
    }
    
    const totalPosts = await CommunityPost.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);
    
    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { title, content, tags, category, images, difficulty } = await req.json();
    
    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be 200 characters or less' },
        { status: 400 }
      );
    }
    
    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Content must be 2000 characters or less' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Create new post
    const newPost = new CommunityPost({
      author: user._id,
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
      category: category || 'question',
      images: images || [],
      difficulty: difficulty || 'beginner'
    });
    
    await newPost.save();
    
    // Populate author info for response
    await newPost.populate('author', '-password -resetPasswordToken -resetPasswordExpires');
    
    return NextResponse.json({
      message: 'Post created successfully',
      post: {
        ...newPost.toObject(),
        voteScore: 0,
        replyCount: 0
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
