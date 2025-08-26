import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { User } from '@/models/User';

// Define admin permissions system
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  MODERATOR: 'moderator',
  PREMIUM_USER: 'premium_user',
  USER: 'user'
};

const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_PROBLEMS: 'manage_problems',
  MANAGE_CONTESTS: 'manage_contests',
  VIEW_ANALYTICS: 'view_analytics',
  MODERATE_CONTENT: 'moderate_content',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions'
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_PROBLEMS, 
    PERMISSIONS.MANAGE_CONTESTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.MANAGE_SUBSCRIPTIONS
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_PROBLEMS,
    PERMISSIONS.MANAGE_CONTESTS, 
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MODERATE_CONTENT
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  [ROLES.PREMIUM_USER]: [],
  [ROLES.USER]: []
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ 
        isAdmin: false, 
        permissions: [],
        role: ROLES.USER 
      }, { status: 401 });
    }

    await dbConnect();

    // Find user in database
    const user = await User.findOne({
      $or: [
        { email: session.user.email },
        { username: session.user.email }
      ]
    });

    if (!user) {
      return NextResponse.json({ 
        isAdmin: false,
        permissions: [],
        role: ROLES.USER 
      }, { status: 404 });
    }

    // Determine user role with proper hierarchy
    let userRole = user.role || ROLES.USER;
    
    // Legacy admin check for existing admin users
    if (user.isAdmin) {
      userRole = ROLES.ADMIN;
    }

    // Super admin override for specific emails (temporary)
    const superAdminEmails = ["rajdeepsingh10789@gmail.com"];
    if (superAdminEmails.includes(user.email)) {
      userRole = ROLES.SUPER_ADMIN;
    }

    // Get permissions for this role
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole);

    return NextResponse.json({
      isAdmin,
      role: userRole,
      permissions,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: userRole,
        isAdmin
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      isAdmin: false,
      permissions: [],
      role: ROLES.USER,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
