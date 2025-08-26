import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import Problem from '../../../../models/Problem';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Find problem by ID (number), slug, or MongoDB _id
    let problem;
    if (!isNaN(id)) {
      // If it's a number, search by id field
      problem = await Problem.findOne({ id: parseInt(id) });
    } else {
      // If it's a string, search by slug or _id
      problem = await Problem.findOne({
        $or: [
          { slug: id },
          { _id: id }
        ]
      });
    }

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Transform the problem for the response (without user context)
    const transformedProblem = {
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      description: problem.description,
      examples: problem.examples,
      constraints: problem.constraints,
      tags: problem.tags,
      templates: problem.templates,
      solutions: problem.solutions,
      hints: problem.hints,
      testCases: problem.testCases,
      status: 'not-attempted', // Default status for now
      acceptanceRate: problem.acceptanceRate || 0,
      likes: problem.likes || 0,
      dislikes: problem.dislikes || 0,
      totalSubmissions: problem.totalSubmissions || 0,
      successfulSubmissions: problem.successfulSubmissions || 0
    };

    return NextResponse.json(transformedProblem);

  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
