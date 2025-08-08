import { NextResponse } from 'next/server';
import Problem from '../../../models/Problem.js';
import dbConnect from '../../../utils/dbConnect.js';

export async function GET() {
  try {
    await dbConnect();
    
    // Get today's date string for consistent daily challenge
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').join(''); // YYYYMMDD
    const randomIndex = parseInt(seed) % 100; // Use date as seed for consistent daily challenge
    
    // Get a problem for today's challenge
    const totalProblems = await Problem.countDocuments({ isPremium: { $ne: true } });
    const skipCount = randomIndex % totalProblems;
    
    const challenge = await Problem.findOne({ isPremium: { $ne: true } })
      .skip(skipCount)
      .lean();
    
    if (!challenge) {
      return NextResponse.json({
        success: false,
        error: 'No daily challenge available'
      });
    }

    return NextResponse.json({
      success: true,
      challenge: {
        id: challenge._id.toString(),
        title: challenge.title,
        difficulty: challenge.difficulty,
        category: challenge.category,
        description: challenge.problemStatement ? challenge.problemStatement.substring(0, 150) + '...' : '',
        date: today
      }
    });

  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch daily challenge' },
      { status: 500 }
    );
  }
}
