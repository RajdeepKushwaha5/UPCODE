import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import dbConnect from "@/utils/dbConnect";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const userEmail = session.user.email;

    // Find the user first
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update or create UserInfo
    let userInfo;
    if (user.userInfo) {
      // Update existing UserInfo
      userInfo = await UserInfo.findByIdAndUpdate(
        user.userInfo,
        { $set: body },
        { new: true, upsert: true }
      );
    } else {
      // Create new UserInfo
      userInfo = new UserInfo(body);
      await userInfo.save();

      // Link UserInfo to User
      user.userInfo = userInfo._id;
      await user.save();
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userInfo
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}