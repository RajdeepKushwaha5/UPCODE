import { NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect.js";
import { User } from "../../../models/User.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Check if username is at least 3 characters
    if (username.length < 3) {
      return NextResponse.json({ available: false, message: "Username must be at least 3 characters" });
    }

    await dbConnect();

    // Check if username already exists (case-insensitive)
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    });

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? "Username is already taken" : "Username is available"
    });

  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
