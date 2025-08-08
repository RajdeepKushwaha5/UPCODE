import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/dbConnect";
import { User } from "@/models/User";
import { checkAdminAccess } from "@/utils/adminCheck";

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
    const { isAdmin, user: adminUser } = await checkAdminAccess(session.user.email);
    
    if (!adminUser || !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeUsers,
      premiumUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 
        lastActiveAt: { $gte: weekStart } 
      }),
      User.countDocuments({ 
        isPremium: true, 
        premiumExpiry: { $gt: now } 
      }),
      User.countDocuments({ 
        createdAt: { $gte: todayStart } 
      }),
      User.countDocuments({ 
        createdAt: { $gte: weekStart } 
      }),
      User.countDocuments({ 
        createdAt: { $gte: monthStart } 
      })
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      premiumUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error("User stats API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
