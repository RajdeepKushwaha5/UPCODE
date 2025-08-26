import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/dbConnect";
import { User } from "@/models/User";

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
    
    // Check admin permissions
    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    const adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || (!adminUser.isAdmin && adminUser.role !== 'admin' && !adminEmails.includes(session.user.email))) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const filter = searchParams.get('filter') || 'all'; // all, active, expired, expiring-soon
    const search = searchParams.get('search') || '';

    let query = {};
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Build query based on filter
    switch (filter) {
      case 'active':
        query = {
          isPremium: true,
          premiumExpiry: { $gt: now }
        };
        break;
      case 'expired':
        query = {
          $or: [
            { isPremium: true, premiumExpiry: { $lte: now } },
            { isPremium: false, premiumExpiry: { $exists: true } }
          ]
        };
        break;
      case 'expiring-soon':
        query = {
          isPremium: true,
          premiumExpiry: { $gte: now, $lte: nextWeek }
        };
        break;
      case 'premium-history':
        query = {
          premiumExpiry: { $exists: true }
        };
        break;
      default:
        // For 'all', no additional filters
        break;
    }

    // Add search functionality
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Get premium users with pagination
    const premiumUsers = await User.find(query)
      .select('email username isPremium premiumExpiry premiumPlan createdAt lastActiveAt')
      .populate('userInfo', 'firstName lastName')
      .sort({ premiumExpiry: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);

    // Get premium statistics
    const [
      totalPremiumUsers,
      activePremiumUsers,
      expiredPremiumUsers,
      expiringSoonUsers,
      monthlyRevenue,
      newPremiumThisMonth
    ] = await Promise.all([
      User.countDocuments({ premiumExpiry: { $exists: true } }),
      User.countDocuments({ isPremium: true, premiumExpiry: { $gt: now } }),
      User.countDocuments({
        $or: [
          { isPremium: true, premiumExpiry: { $lte: now } },
          { isPremium: false, premiumExpiry: { $exists: true } }
        ]
      }),
      User.countDocuments({
        isPremium: true,
        premiumExpiry: { $gte: now, $lte: nextWeek }
      }),
      User.countDocuments({ isPremium: true, premiumExpiry: { $gt: now } }) * 15, // Assuming $15/month
      User.countDocuments({
        isPremium: true,
        createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }
      })
    ]);

    const conversionRate = totalUsers > 0 ? ((activePremiumUsers / totalUsers) * 100).toFixed(1) : 0;
    const churnRate = totalPremiumUsers > 0 ? ((expiredPremiumUsers / totalPremiumUsers) * 100).toFixed(1) : 0;

    const stats = {
      totalPremiumUsers,
      activePremiumUsers,
      expiredPremiumUsers,
      expiringSoonUsers,
      monthlyRevenue,
      newPremiumThisMonth,
      conversionRate: parseFloat(conversionRate),
      churnRate: parseFloat(churnRate)
    };

    return NextResponse.json({
      success: true,
      users: premiumUsers.map(user => ({
        _id: user._id,
        email: user.email,
        username: user.username || user.email.split('@')[0],
        fullName: user.userInfo ? `${user.userInfo.firstName || ''} ${user.userInfo.lastName || ''}`.trim() || 'N/A' : 'N/A',
        isPremium: user.isPremium,
        premiumExpiry: user.premiumExpiry,
        premiumPlan: user.premiumPlan || 'monthly',
        status: user.isPremium && user.premiumExpiry && user.premiumExpiry > now ? 'active' : 'expired',
        daysSinceActive: user.lastActiveAt ? Math.floor((now - new Date(user.lastActiveAt)) / (1000 * 60 * 60 * 24)) : 0,
        joinedDate: user.createdAt
      })),
      stats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error("Premium control API error:", error);
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
    
    // Check admin permissions
    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    const adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || (!adminUser.isAdmin && adminUser.role !== 'admin' && !adminEmails.includes(session.user.email))) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const { action, userId, duration, plan } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 404 });
    }

    const now = new Date();

    switch (action) {
      case 'grant':
        const expiryDate = new Date(now.getTime() + (duration || 30) * 24 * 60 * 60 * 1000);
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          premiumExpiry: expiryDate,
          premiumPlan: plan || 'monthly',
          premiumGrantedBy: adminUser._id,
          premiumGrantedAt: now
        });
        break;
        
      case 'extend':
        const currentExpiry = user.premiumExpiry || now;
        const newExpiry = new Date(Math.max(currentExpiry.getTime(), now.getTime()) + (duration || 30) * 24 * 60 * 60 * 1000);
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          premiumExpiry: newExpiry,
          premiumPlan: plan || user.premiumPlan || 'monthly'
        });
        break;
        
      case 'revoke':
        await User.findByIdAndUpdate(userId, {
          isPremium: false,
          premiumRevokedAt: now,
          premiumRevokedBy: adminUser._id
        });
        break;
        
      case 'send-renewal-reminder':
        // In a real implementation, you would send an email here
        console.log(`Renewal reminder sent to ${user.email}`);
        break;
        
      default:
        return NextResponse.json({ 
          success: false, 
          message: "Invalid action" 
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Premium ${action} completed successfully`
    });

  } catch (error) {
    console.error("Premium action API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
