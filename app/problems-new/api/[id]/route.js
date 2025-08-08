import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToDatabase();
    
    let problem;
    
    // Try to find by numeric ID first, then by MongoDB ObjectId
    if (/^\d+$/.test(id)) {
      problem = await db.collection('problems-new').findOne({ id: parseInt(id) });
    } else {
      try {
        problem = await db.collection('problems-new').findOne({ _id: new ObjectId(id) });
      } catch (err) {
        // Invalid ObjectId format
        problem = null;
      }
    }
    
    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await db.collection('problems-new').updateOne(
      { _id: problem._id },
      { $inc: { views: 1 } }
    );

    return NextResponse.json({
      success: true,
      problem
    });

  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}
