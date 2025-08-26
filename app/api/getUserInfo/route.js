import dbConnect from "../../../utils/dbConnect";
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'
import { UserInfo } from '../../../models/UserInfo';
import { User } from "../../../models/User";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (session?.user?._id) {
    const user = await User.findById(session?.user?._id)
    const data = await UserInfo.findById(user.userInfo)
    
    // Include user creation date and other relevant user info
    const userInfoWithJoinDate = {
      ...data.toObject(),
      joinDate: user.createdAt,
      username: user.username,
      email: user.email
    };
    
    return new Response(JSON.stringify(userInfoWithJoinDate), { status: 200 })
  }
  else return new Response("User not logged in")
}