import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/dbConnect";
import { User } from "@/models/User";
import Problem from "@/models/Problem";
import { Submission } from "@/models/Submission";

export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    await dbConnect();
    
    // Check admin permissions using checkAdminAccess utility
    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    const adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || (!adminUser.isAdmin && !adminUser.role === 'admin' && !adminEmails.includes(session.user.email))) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || 'all';
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (category !== 'all') {
      query.category = category;
    }
    if (status !== 'all') {
      query.status = status;
    }

    // Execute queries
    const [problems, totalCount] = await Promise.all([
      Problem.find(query)
        .select('title difficulty category tags createdAt updatedAt isPublished isPremium')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Problem.countDocuments(query)
    ]);

    // Get submission stats for each problem
    const problemsWithStats = await Promise.all(
      problems.map(async (problem) => {
        const [totalSubmissions, acceptedSubmissions] = await Promise.all([
          Submission.countDocuments({ problemId: problem._id }),
          Submission.countDocuments({ 
            problemId: problem._id, 
            status: 'accepted' 
          })
        ]);

        const acceptanceRate = totalSubmissions > 0 
          ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
          : 0;

        return {
          id: problem._id,
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          tags: problem.tags || [],
          submissions: totalSubmissions,
          acceptance: parseFloat(acceptanceRate),
          status: problem.isPublished ? 'Published' : 'Draft',
          isPremium: problem.isPremium || false,
          createdAt: problem.createdAt,
          updatedAt: problem.updatedAt
        };
      })
    );

    // Get overall statistics
    const [
      totalProblems,
      publishedProblems,
      draftProblems,
      premiumProblems,
      easyProblems,
      mediumProblems,
      hardProblems
    ] = await Promise.all([
      Problem.countDocuments(),
      Problem.countDocuments({ isPublished: true }),
      Problem.countDocuments({ isPublished: false }),
      Problem.countDocuments({ isPremium: true }),
      Problem.countDocuments({ difficulty: 'Easy' }),
      Problem.countDocuments({ difficulty: 'Medium' }),
      Problem.countDocuments({ difficulty: 'Hard' })
    ]);

    const stats = {
      totalProblems,
      publishedProblems,
      draftProblems,
      premiumProblems,
      difficultyDistribution: {
        easy: easyProblems,
        medium: mediumProblems,
        hard: hardProblems
      }
    };

    return NextResponse.json({
      success: true,
      problems: problemsWithStats,
      stats,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error("Problems API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    await dbConnect();
    const adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const { problemId, updates } = await request.json();

    if (!problemId || !updates) {
      return NextResponse.json({ 
        success: false, 
        message: "Problem ID and updates are required" 
      }, { status: 400 });
    }

    const problem = await Problem.findByIdAndUpdate(
      problemId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!problem) {
      return NextResponse.json({ 
        success: false, 
        message: "Problem not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Problem updated successfully",
      problem
    });

  } catch (error) {
    console.error("Problem update API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    await dbConnect();
    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    const adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || (!adminUser.isAdmin && adminUser.role !== 'admin' && !adminEmails.includes(session.user.email))) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const problemData = await request.json();

    if (!problemData.title) {
      return NextResponse.json({ 
        success: false, 
        message: "Problem title is required" 
      }, { status: 400 });
    }

    // Create new problem
    const newProblem = new Problem({
      ...problemData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: true, // Default to published
      order: await Problem.countDocuments() + 1 // Auto-increment order
    });

    await newProblem.save();

    return NextResponse.json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem
    });

  } catch (error) {
    console.error("Problem creation API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    await dbConnect();
    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    const adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || (!adminUser.isAdmin && adminUser.role !== 'admin' && !adminEmails.includes(session.user.email))) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const { problemId } = await request.json();

    if (!problemId) {
      return NextResponse.json({ 
        success: false, 
        message: "Problem ID is required" 
      }, { status: 400 });
    }

    const deletedProblem = await Problem.findByIdAndDelete(problemId);

    if (!deletedProblem) {
      return NextResponse.json({ 
        success: false, 
        message: "Problem not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Problem deleted successfully"
    });

  } catch (error) {
    console.error("Problem deletion API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
