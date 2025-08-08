import dbConnect from '../../../../utils/dbConnect.js'
import Problem from '../../../../models/Problem'

export async function POST(request) {
  try {
    const { problemSlug, status, language, runtime, memory } = await request.json()
    
    if (!problemSlug || !status) {
      return Response.json({
        success: false,
        message: 'Problem slug and status are required'
      }, { status: 400 })
    }

    await dbConnect()
    
    // Find the problem
    const problem = await Problem.findOne({ slug: problemSlug })
    
    if (!problem) {
      return Response.json({
        success: false,
        message: 'Problem not found'
      }, { status: 404 })
    }

    // Update problem statistics
    if (status === 'solved') {
      // Increment solved count
      problem.solvedCount = (problem.solvedCount || 0) + 1
      
      // Update acceptance rate
      problem.totalSubmissions = (problem.totalSubmissions || 0) + 1
      const newAcceptanceRate = Math.round((problem.solvedCount / problem.totalSubmissions) * 100)
      problem.acceptanceRate = newAcceptanceRate
    } else {
      // Just increment submission count for non-accepted submissions
      problem.totalSubmissions = (problem.totalSubmissions || 0) + 1
      const newAcceptanceRate = Math.round(((problem.solvedCount || 0) / problem.totalSubmissions) * 100)
      problem.acceptanceRate = newAcceptanceRate
    }

    await problem.save()

    // In a real application, you would also:
    // 1. Update user's solved problems list
    // 2. Save the submission details
    // 3. Update user statistics
    // 4. Award points/badges
    
    /* Example user update code:
    if (req.user) {
      const user = await User.findById(req.user.id)
      if (user) {
        if (status === 'solved' && !user.solvedProblems.includes(problem._id)) {
          user.solvedProblems.push(problem._id)
          user.totalSolved += 1
          user.points += getProblemPoints(problem.difficulty)
          await user.save()
        }
      }
    }
    */

    return Response.json({
      success: true,
      message: 'Problem status updated successfully',
      data: {
        problemSlug,
        status,
        newAcceptanceRate: problem.acceptanceRate,
        totalSubmissions: problem.totalSubmissions,
        solvedCount: problem.solvedCount
      }
    })

  } catch (error) {
    console.error('Error updating problem status:', error)
    return Response.json({
      success: false,
      message: 'Failed to update problem status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
