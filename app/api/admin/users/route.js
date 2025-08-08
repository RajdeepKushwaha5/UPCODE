import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import { UserInfo } from '@/models/UserInfo';
import { Contest } from '@/models/Contest';
import { SolvedProblem } from '@/models/SolvedProblem';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/utils/dbConnect';

export async function GET(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');

    let query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .populate({
        path: 'userInfo',
        select: 'firstName lastName country city college phone profilePicture createdAt'
      })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [solvedCount, contestCount] = await Promise.all([
          SolvedProblem.countDocuments({ user: user.userInfo?._id }),
          Contest.countDocuments({ registeredUsers: user.userInfo?._id })
        ]);

        return {
          id: user._id,
          username: user.username,
          email: user.email,
          verified: user.verified || false,
          isActive: user.isActive !== false,
          userInfo: user.userInfo,
          stats: {
            problemsSolved: solvedCount,
            contestsParticipated: contestCount,
            joinDate: user.createdAt,
            lastActive: user.updatedAt
          },
          createdAt: user.createdAt
        };
      })
    );

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com'];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId, action, data } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({
        error: 'User ID and action are required'
      }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'activate':
        result = await User.findByIdAndUpdate(
          userId,
          { isActive: true },
          { new: true }
        );
        break;

      case 'deactivate':
        result = await User.findByIdAndUpdate(
          userId,
          { isActive: false },
          { new: true }
        );
        break;

      case 'verify':
        result = await User.findByIdAndUpdate(
          userId,
          { verified: true },
          { new: true }
        );
        break;

      case 'update':
        if (data.userInfo) {
          await UserInfo.findByIdAndUpdate(
            result.userInfo,
            data.userInfo,
            { new: true }
          );
        }

        if (data.user) {
          result = await User.findByIdAndUpdate(
            userId,
            data.user,
            { new: true }
          );
        }
        break;

      default:
        return NextResponse.json({
          error: 'Invalid action'
        }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      message: `User ${action}d successfully`,
      user: result
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com'];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Find user first to get userInfo ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    // Delete related data
    await Promise.all([
      SolvedProblem.deleteMany({ user: user.userInfo }),
      Contest.updateMany(
        { registeredUsers: user.userInfo },
        { $pull: { registeredUsers: user.userInfo } }
      ),
      UserInfo.findByIdAndDelete(user.userInfo),
      User.findByIdAndDelete(userId)
    ]);

    return NextResponse.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}
