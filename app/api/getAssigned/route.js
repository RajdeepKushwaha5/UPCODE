import {User} from "@/models/User";
import {UserInfo} from "@/models/UserInfo";
import {Queue} from "@/models/Queue";
import {peerVideo} from "@/models/PeerVideo";
import {question} from "@/models/Question";
import dbConnect from '@/utils/dbConnect';

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"


export async function GET() {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const userID = session?.user?._id
        if (session?.user?._id){
            const user = await User.findById(userID)
            const userdata = await UserInfo.findById(user.userInfo).populate({
                path : 'assigned',
                populate : {
                  path : 'peerVideo',
                    populate : {
                        path : 'question',
                  }
                }
              })
            const res = {
                assigned: userdata.assigned,
                assignedTime: userdata.assignedTime

            }
            

          return new Response(JSON.stringify(res),{status: 200})
        }
      } catch (error) {
        // console.error(error);
        return new Response(error,{status: 500}) // Handle any errors
      }
}
