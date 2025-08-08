import { NextResponse } from 'next/server';

// Simulate real-time stats with some variability
const generateRealtimeStats = () => {
  const baseTime = Date.now();
  const hourOfDay = new Date().getHours();
  
  // Activity multiplier based on time of day (higher during work hours)
  const activityMultiplier = hourOfDay >= 9 && hourOfDay <= 17 ? 1.5 : 0.8;
  
  return {
    totalProblems: 18,
    totalUsers: Math.floor(245000 + Math.sin(baseTime / 100000) * 5000),
    activeNow: Math.floor((120 + Math.sin(baseTime / 10000) * 20) * activityMultiplier),
    problemsSolvedToday: Math.floor(1200 + Math.sin(baseTime / 50000) * 200),
    submissionsToday: Math.floor(8500 + Math.sin(baseTime / 30000) * 500),
    lastUpdated: new Date().toISOString()
  };
};

// Generate problem-specific stats
const generateProblemStats = (problemId, difficulty) => {
  const baseTime = Date.now();
  const seed = problemId * 1000; // Consistent seed for each problem
  
  // Base stats based on difficulty
  const difficultyMultipliers = {
    'Easy': { submissions: 50000, acceptance: 0.65 },
    'Medium': { submissions: 30000, acceptance: 0.45 },
    'Hard': { submissions: 15000, acceptance: 0.25 }
  };
  
  const multiplier = difficultyMultipliers[difficulty] || difficultyMultipliers['Medium'];
  
  const totalSubmissions = Math.floor(
    multiplier.submissions + 
    Math.sin((baseTime + seed) / 100000) * (multiplier.submissions * 0.1)
  );
  
  const acceptanceRate = Math.floor(
    (multiplier.acceptance + 
    Math.sin((baseTime + seed) / 200000) * 0.05) * 100
  );
  
  const solvedCount = Math.floor(totalSubmissions * (acceptanceRate / 100));
  
  // Recent activity (submissions in last hour)
  const recentSubmissions = Math.floor(
    (10 + Math.sin((baseTime + seed) / 5000) * 5) * 
    (new Date().getHours() >= 9 && new Date().getHours() <= 17 ? 1.5 : 0.6)
  );
  
  return {
    totalSubmissions,
    solvedCount,
    acceptanceRate,
    recentSubmissions,
    likes: Math.floor(solvedCount * 0.3 + Math.sin((baseTime + seed) / 150000) * 100),
    dislikes: Math.floor(solvedCount * 0.05 + Math.sin((baseTime + seed) / 180000) * 20)
  };
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');
    
    if (problemId) {
      // Return stats for specific problem
      const difficulty = searchParams.get('difficulty') || 'Medium';
      const stats = generateProblemStats(parseInt(problemId), difficulty);
      
      return NextResponse.json({
        success: true,
        problemId: parseInt(problemId),
        stats
      });
    } else {
      // Return global stats
      const globalStats = generateRealtimeStats();
      
      return NextResponse.json({
        success: true,
        global: globalStats
      });
    }
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// For real-time updates
export async function POST(request) {
  try {
    const { action, problemId, userId } = await request.json();
    
    // Simulate recording user actions (solve, attempt, like, etc.)
    const timestamp = new Date().toISOString();
    
    // In a real app, you'd save this to a database
    console.log(`User action recorded: ${action} on problem ${problemId} by user ${userId} at ${timestamp}`);
    
    // Return updated stats
    const stats = generateProblemStats(problemId, 'Medium'); // You'd get actual difficulty from DB
    
    return NextResponse.json({
      success: true,
      message: 'Action recorded',
      updatedStats: stats,
      timestamp
    });
  } catch (error) {
    console.error('Stats recording error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record action' },
      { status: 500 }
    );
  }
}
