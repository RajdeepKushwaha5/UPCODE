import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://codeforces.com/api/user.ratedList?activeOnly=true')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === 'OK') {
      // Get top 30 global users
      const globalRankings = data.result.slice(0, 30)

      // Get top 20 Indian users
      const indianRankings = data.result
        .filter(user => user.country === 'India')
        .slice(0, 20)

      return NextResponse.json({
        status: 'OK',
        result: {
          global: globalRankings,
          indian: indianRankings
        }
      })
    } else {
      throw new Error('Codeforces API returned error status')
    }
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    )
  }
}
