import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '../../../../utils/dbConnect.js'
import { User } from '../../../../models/User.js'
import { getNewProblems } from '../../../../lib/newProblemsData.js'

export async function GET(request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find user by email and get their bookmarked problems
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the bookmarked problem IDs
    const bookmarkedProblemIds = user.bookmarkedProblems || []

    // Get problem details for bookmarked problems from static data
    const allProblems = getNewProblems()
    const bookmarkedQuestions = allProblems.filter(problem => 
      bookmarkedProblemIds.includes(problem.id.toString())
    ).map(problem => ({
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      acceptanceRate: problem.acceptanceRate || '50',
      tags: problem.tags || [],
      category: problem.category || 'General'
    }))

    return NextResponse.json({ bookmarkedQuestions })
  } catch (error) {
    console.error('Error fetching bookmarked questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
