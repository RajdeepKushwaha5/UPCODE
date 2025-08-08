import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { User } from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    await dbConnect();

    // Find user in database
    const user = await User.findOne({
      $or: [
        { email: session.user.email },
        { username: session.user.email } // In case email is stored as username
      ]
    });

    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 404 });
    }

    // Check if user has admin role
    // Check multiple admin indicators: isAdmin flag, role field, or specific admin emails
    const adminEmails = ["admin@upcode.com", "sarah@upcode.com", "rajdeepsingh10789@gmail.com"];
    const isAdmin = user.isAdmin || user.role === "admin" || adminEmails.includes(user.email);

    return NextResponse.json({
      isAdmin,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role || "user",
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
