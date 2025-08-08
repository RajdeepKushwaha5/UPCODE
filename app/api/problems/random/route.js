import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get total count of problems
    const totalProblems = await db.collection('problems').countDocuments({});
    
    if (totalProblems === 0) {
      return NextResponse.json(
        { error: 'No problems available' },
        { status: 404 }
      );
    }
    
    // Generate random skip value
    const randomSkip = Math.floor(Math.random() * totalProblems);
    
    // Get random problem
    const problem = await db.collection('problems')
      .findOne({}, { skip: randomSkip });
    
    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
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
      }
    });
    
  } catch (error) {
    console.error('Error fetching random problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random problem' },
      { status: 500 }
    );
  }
}
