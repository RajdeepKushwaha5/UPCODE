import dbConnect from '@/utils/dbConnect';
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo.js";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route.js"

export async function POST(req) {

  try {
    const session = await getServerSession(authOptions);
    const userID = session?.user?._id;
    if (userID) {
      await dbConnect();
      const body = await req.json()
      const user = await User.findById(userID)

      // Update UserInfo with all fields including petEmoji
      await UserInfo.findByIdAndUpdate(user.userInfo, {
        ...body,
        petEmoji: body.petEmoji || "🐱" // Default to cat emoji if not provided
      })

      return new Response(JSON.stringify({ message: 'User Data Updated' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    else {
      return new Response(JSON.stringify({ error: 'User Not Found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
