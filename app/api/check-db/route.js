import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect.js';
import Problem from '../../../models/Problem.js';

export async function GET(request) {
  try {
    await dbConnect();
    
    const totalProblems = await Problem.countDocuments();
    const problems = await Problem.find({}).limit(10).lean();
    
    return NextResponse.json({
      success: true,
      total: totalProblems,
      sample: problems.map(p => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        category: p.category
      }))
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
