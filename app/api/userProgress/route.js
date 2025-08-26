import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { User } from '../../../models/User'
import { SolvedProblem } from '../../../models/SolvedProblem'
import dbConnect from '../../../utils/dbConnect'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get solved problems
    const solvedProblems = await SolvedProblem.find({ userId: user._id })

    // Calculate stats
    const stats = {
      totalSolved: solvedProblems.length,
      easySolved: solvedProblems.filter(p => p.difficulty === 'Easy').length,
      mediumSolved: solvedProblems.filter(p => p.difficulty === 'Medium').length,
      hardSolved: solvedProblems.filter(p => p.difficulty === 'Hard').length,
      totalXP: solvedProblems.reduce((sum, p) => sum + (p.xpEarned || 0), 0),
      currentStreak: calculateStreak(solvedProblems),
      longestStreak: user.longestStreak || 0,
      rank: user.rank || 'Unranked',
      submissions: solvedProblems.reduce((sum, p) => sum + (p.attempts || 1), 0)
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Progress tracking error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { problemId, difficulty, xpEarned, timeSpent } = await request.json()

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if problem already solved
    const existingSolution = await SolvedProblem.findOne({
      userId: user._id,
      problemId: problemId
    })

    if (existingSolution) {
      // Update existing solution
      existingSolution.attempts += 1
      existingSolution.lastSolvedAt = new Date()
      if (timeSpent < existingSolution.bestTime) {
        existingSolution.bestTime = timeSpent
        existingSolution.xpEarned += Math.floor(xpEarned * 0.1) // Bonus for improvement
      }
      await existingSolution.save()
    } else {
      // Create new solved problem record
      const solvedProblem = new SolvedProblem({
        userId: user._id,
        problemId: problemId,
        difficulty: difficulty,
        solvedAt: new Date(),
        lastSolvedAt: new Date(),
        xpEarned: xpEarned,
        timeSpent: timeSpent,
        bestTime: timeSpent,
        attempts: 1
      })
      await solvedProblem.save()

      // Update user stats
      user.totalXP = (user.totalXP || 0) + xpEarned
      user.problemsSolved = (user.problemsSolved || 0) + 1

      // Update streak
      const today = new Date()
      const lastSolved = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null

      if (lastSolved) {
        const diffTime = today.getTime() - lastSolved.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          user.currentStreak = (user.currentStreak || 0) + 1
        } else if (diffDays > 1) {
          user.currentStreak = 1
        }
      } else {
        user.currentStreak = 1
      }

      user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak)
      user.lastSolvedDate = today

      await user.save()
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully'
    })

  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

function calculateStreak(solvedProblems) {
  if (solvedProblems.length === 0) return 0

  // Sort by date
  const sortedProblems = solvedProblems.sort((a, b) =>
    new Date(b.solvedAt) - new Date(a.solvedAt)
  )

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const problem of sortedProblems) {
    const problemDate = new Date(problem.solvedAt)
    problemDate.setHours(0, 0, 0, 0)

    const diffTime = currentDate.getTime() - problemDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
