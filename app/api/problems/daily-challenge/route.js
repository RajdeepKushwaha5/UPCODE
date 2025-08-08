import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Check if there's already a daily challenge for today
    let dailyChallenge = await db.collection('daily-challenges').findOne({
      date: today
    });
    
    if (!dailyChallenge) {
      // No challenge for today, create one
      dailyChallenge = await createDailyChallenge(db, today);
    }
    
    if (!dailyChallenge || !dailyChallenge.problemId) {
      return NextResponse.json(
        { error: 'Daily challenge not available' },
        { status: 404 }
      );
    }
    
    // Fetch the actual problem
    const problem = await db.collection('problems').findOne({
      _id: dailyChallenge.problemId
    });
    
    if (!problem) {
      return NextResponse.json(
        { error: 'Daily challenge problem not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      problem: {
        id: problem._id.toString(),
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        description: problem.description,
        examples: problem.examples,
        constraints: problem.constraints
      },
      challengeInfo: {
        date: dailyChallenge.date,
        isDaily: true,
        challengeNumber: dailyChallenge.challengeNumber
      }
    });
    
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily challenge' },
      { status: 500 }
    );
  }
}

async function createDailyChallenge(db, date) {
  try {
    // Get total number of problems
    const totalProblems = await db.collection('problems').countDocuments({});
    
    if (totalProblems === 0) {
      return null;
    }
    
    // Get count of previous daily challenges to ensure we don't repeat soon
    const challengeCount = await db.collection('daily-challenges').countDocuments({});
    
    // Calculate which problem to use (cycle through all problems)
    const problemIndex = challengeCount % totalProblems;
    
    // Get the problem at this index
    const problem = await db.collection('problems')
      .findOne({}, { skip: problemIndex });
    
    if (!problem) {
      return null;
    }
    
    // Create daily challenge record
    const dailyChallenge = {
      date,
      problemId: problem._id,
      challengeNumber: challengeCount + 1,
      createdAt: new Date()
    };
    
    await db.collection('daily-challenges').insertOne(dailyChallenge);
    
    return dailyChallenge;
    
  } catch (error) {
    console.error('Error creating daily challenge:', error);
    return null;
  }
}

// Optional: GET endpoint to fetch challenge history
export async function POST(request) {
  try {
    const { action, date } = await request.json();
    
    if (action === 'history') {
      const { db } = await connectToDatabase();
      
      // Get recent daily challenges
      const challenges = await db.collection('daily-challenges')
        .find({})
        .sort({ date: -1 })
        .limit(30)
        .toArray();
      
      // Populate with problem details
      const challengesWithProblems = await Promise.all(
        challenges.map(async (challenge) => {
          const problem = await db.collection('problems').findOne({
            _id: challenge.problemId
          });
          
          return {
            ...challenge,
            problem: problem ? {
              id: problem._id.toString(),
              title: problem.title,
              difficulty: problem.difficulty,
              category: problem.category
            } : null
          };
        })
      );
      
      return NextResponse.json({
        success: true,
        challenges: challengesWithProblems
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error handling daily challenge POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
