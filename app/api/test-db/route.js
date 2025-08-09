import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import { User } from '../../../models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Test basic database operations
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
