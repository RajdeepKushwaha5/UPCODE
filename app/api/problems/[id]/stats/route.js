// Enhanced API endpoint for problem statistics and community data
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Mock community statistics - replace with real database queries
    const communityStats = {
      successRate: 0.68,
      averageSolveTime: 22,
      averageAttempts: 2.1,
      totalSubmissions: 15420,
      acceptedSubmissions: 10485,
      ratingDistribution: {
        1: 145, // Very Hard
        2: 892, // Hard  
        3: 4567, // Medium
        4: 3821, // Easy
        5: 995   // Very Easy
      },
      languageDistribution: {
        python: 0.35,
        javascript: 0.22,
        java: 0.18,
        cpp: 0.15,
        other: 0.10
      },
      performanceMetrics: {
        fastestSubmission: {
          runtime: '28ms',
          memory: '12.1MB',
          language: 'C++',
          author: 'speed_demon'
        },
        mostOptimalMemory: {
          runtime: '45ms',
          memory: '9.8MB',
          language: 'Python',
          author: 'memory_master'
        }
      },
      timeDistribution: {
        '0-5min': 0.15,
        '5-15min': 0.35,
        '15-30min': 0.30,
        '30-60min': 0.15,
        '60min+': 0.05
      },
      difficultyFeedback: {
        tooEasy: 0.12,
        justRight: 0.64,
        tooHard: 0.24
      },
      conceptsStruggledWith: [
        { concept: 'Hash Map Implementation', percentage: 0.28 },
        { concept: 'Edge Case Handling', percentage: 0.22 },
        { concept: 'Time Complexity Optimization', percentage: 0.18 },
        { concept: 'Space Complexity', percentage: 0.15 }
      ],
      recentTrends: {
        weeklyAttempts: [1200, 1350, 1180, 1420, 1600, 1380, 1250],
        weeklySuccessRate: [0.65, 0.68, 0.66, 0.70, 0.72, 0.69, 0.68]
      }
    }

    return NextResponse.json({
      success: true,
      stats: communityStats
    })

  } catch (error) {
    console.error('Error fetching problem stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problem statistics' },
      { status: 500 }
    )
  }
}
