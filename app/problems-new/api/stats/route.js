import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get basic stats
    const [
      totalProblems,
      easyProblems,
      mediumProblems,
      hardProblems,
      recentSubmissions
    ] = await Promise.all([
      db.collection('problems-new').countDocuments(),
      db.collection('problems-new').countDocuments({ difficulty: 'Easy' }),
      db.collection('problems-new').countDocuments({ difficulty: 'Medium' }),
      db.collection('problems-new').countDocuments({ difficulty: 'Hard' }),
      db.collection('submissions').find().sort({ timestamp: -1 }).limit(10).toArray()
    ]);

    // Get problem categories
    const categories = await db.collection('problems-new').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray();

    // Get company tags
    const companies = await db.collection('problems-new').aggregate([
      {
        $unwind: '$companies'
      },
      {
        $group: {
          _id: '$companies',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 20
      }
    ]).toArray();

    return NextResponse.json({
      success: true,
      stats: {
        total: totalProblems,
        easy: easyProblems,
        medium: mediumProblems,
        hard: hardProblems,
        categories: categories.map(cat => ({
          name: cat._id,
          count: cat.count
        })),
        companies: companies.map(comp => ({
          name: comp._id,
          count: comp.count
        })),
        recentSubmissions
      }
    });

  } catch (error) {
    console.error('Error fetching problem stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problem statistics' },
      { status: 500 }
    );
  }
}
