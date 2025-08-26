import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { InputValidator } from '../../../lib/validation';
import { apiRateLimit } from '../../../lib/rateLimiting';
import { withErrorLogging } from '../../../lib/logger';
import dbConnect from '../../../utils/dbConnect';
import { User } from '../../../models/User';
import logger from '../../../lib/logger';

/**
 * Example secure API route demonstrating all security features
 * GET /api/user/profile - Get user profile
 * PUT /api/user/profile - Update user profile
 */

async function handleGET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    logger.warn('Unauthorized access attempt to user profile', {
      ip: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent')
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  
  try {
    const user = await User.findOne({ email: session.user.email })
      .select('-password -__v')
      .lean();

    if (!user) {
      logger.error('User not found in database', null, { email: session.user.email });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logger.info('User profile retrieved', { userId: user._id });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        createdAt: user.createdAt,
        // Only include safe fields
      }
    });

  } catch (error) {
    logger.error('Database error retrieving user profile', error, {
      userId: session.user._id
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePUT(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    logger.securityEvent('Unauthorized profile update attempt', 'medium', {
      ip: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent')
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    logger.warn('Invalid JSON in profile update request', {
      userId: session.user._id,
      error: error.message
    });
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400 }
    );
  }

  // Input validation
  const updates = {};
  
  try {
    // Validate each field if provided
    if (body.username) {
      updates.username = InputValidator.validateUsername(body.username);
    }
    
    if (body.firstName) {
      updates.firstName = InputValidator.sanitizeString(body.firstName);
      if (updates.firstName.length > 50) {
        throw new Error('First name must be less than 50 characters');
      }
    }
    
    if (body.lastName) {
      updates.lastName = InputValidator.sanitizeString(body.lastName);
      if (updates.lastName.length > 50) {
        throw new Error('Last name must be less than 50 characters');
      }
    }
    
    if (body.bio) {
      updates.bio = InputValidator.sanitizeHtml(body.bio);
      if (updates.bio.length > 500) {
        throw new Error('Bio must be less than 500 characters');
      }
    }

    // Validate age if provided
    if (body.age) {
      const age = parseInt(body.age);
      if (isNaN(age) || age < 13 || age > 120) {
        throw new Error('Age must be between 13 and 120');
      }
      updates.age = age;
    }

  } catch (error) {
    logger.warn('Profile update validation failed', {
      userId: session.user._id,
      error: error.message,
      attemptedData: Object.keys(body)
    });
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // Prevent updating sensitive fields
  delete updates.email;
  delete updates.password;
  delete updates.role;
  delete updates.isAdmin;
  delete updates._id;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  }

  await dbConnect();
  
  try {
    // Check if username is already taken (if username is being updated)
    if (updates.username) {
      const existingUser = await User.findOne({
        username: updates.username,
        _id: { $ne: session.user._id }
      });

      if (existingUser) {
        logger.warn('Username already taken attempt', {
          userId: session.user._id,
          attemptedUsername: updates.username
        });
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      session.user._id,
      { 
        ...updates,
        updatedAt: new Date()
      },
      { 
        new: true,
        select: '-password -__v'
      }
    ).lean();

    if (!updatedUser) {
      logger.error('User not found during profile update', null, {
        userId: session.user._id
      });
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    logger.info('User profile updated successfully', {
      userId: session.user._id,
      updatedFields: Object.keys(updates)
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: updatedUser.bio,
        age: updatedUser.age,
        email: updatedUser.email,
        role: updatedUser.role || 'user',
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    logger.error('Database error updating user profile', error, {
      userId: session.user._id,
      updates: Object.keys(updates)
    });
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { error: `${field} is already taken` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply security middleware
export const GET = apiRateLimit(withErrorLogging(handleGET));
export const PUT = apiRateLimit(withErrorLogging(handlePUT));
