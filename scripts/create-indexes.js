#!/usr/bin/env node

/**
 * Database Indexing Script for UPCODE
 * Run this to create optimal indexes for better query performance
 */

import { connectToDatabase } from '../lib/mongodb.js';

const indexes = {
  // Users collection indexes
  users: [
    { fields: { email: 1 }, options: { unique: true, name: 'email_unique' } },
    { fields: { username: 1 }, options: { unique: true, name: 'username_unique' } },
    { fields: { role: 1 }, options: { name: 'role_index' } },
    { fields: { createdAt: 1 }, options: { name: 'created_at_index' } },
    { fields: { 'subscription.status': 1 }, options: { name: 'subscription_status_index' } },
  ],

  // Problems collection indexes
  problems: [
    { fields: { id: 1 }, options: { unique: true, name: 'problem_id_unique' } },
    { fields: { problemId: 1 }, options: { name: 'problem_id_index' } },
    { fields: { title: 1 }, options: { name: 'title_index' } },
    { fields: { difficulty: 1 }, options: { name: 'difficulty_index' } },
    { fields: { category: 1 }, options: { name: 'category_index' } },
    { fields: { tags: 1 }, options: { name: 'tags_index' } },
    { fields: { isPremium: 1 }, options: { name: 'premium_index' } },
    { fields: { difficulty: 1, category: 1 }, options: { name: 'difficulty_category_compound' } },
    { fields: { title: 'text', description: 'text' }, options: { name: 'search_text_index' } },
  ],

  // Submissions collection indexes
  submissions: [
    { fields: { userId: 1 }, options: { name: 'user_submissions_index' } },
    { fields: { problemId: 1 }, options: { name: 'problem_submissions_index' } },
    { fields: { userId: 1, problemId: 1 }, options: { name: 'user_problem_compound' } },
    { fields: { submittedAt: 1 }, options: { name: 'submitted_at_index' } },
    { fields: { status: 1 }, options: { name: 'status_index' } },
    { fields: { language: 1 }, options: { name: 'language_index' } },
    { fields: { userId: 1, submittedAt: -1 }, options: { name: 'user_recent_submissions' } },
  ],

  // UserProgress collection indexes
  userprogresses: [
    { fields: { userId: 1 }, options: { unique: true, name: 'user_progress_unique' } },
    { fields: { 'solvedProblems.problemId': 1 }, options: { name: 'solved_problems_index' } },
    { fields: { 'attemptedProblems.problemId': 1 }, options: { name: 'attempted_problems_index' } },
  ],

  // Contests collection indexes
  contests: [
    { fields: { contestId: 1 }, options: { unique: true, name: 'contest_id_unique' } },
    { fields: { startTime: 1 }, options: { name: 'start_time_index' } },
    { fields: { endTime: 1 }, options: { name: 'end_time_index' } },
    { fields: { status: 1 }, options: { name: 'contest_status_index' } },
    { fields: { startTime: 1, endTime: 1 }, options: { name: 'contest_time_range' } },
  ],

  // Leaderboard collection indexes
  leaderboards: [
    { fields: { userId: 1 }, options: { name: 'leaderboard_user_index' } },
    { fields: { contestId: 1 }, options: { name: 'leaderboard_contest_index' } },
    { fields: { score: -1 }, options: { name: 'score_desc_index' } },
    { fields: { contestId: 1, score: -1 }, options: { name: 'contest_leaderboard' } },
  ],

  // Community Posts indexes
  communityposts: [
    { fields: { authorId: 1 }, options: { name: 'author_posts_index' } },
    { fields: { problemId: 1 }, options: { name: 'problem_posts_index' } },
    { fields: { createdAt: -1 }, options: { name: 'recent_posts_index' } },
    { fields: { tags: 1 }, options: { name: 'post_tags_index' } },
    { fields: { title: 'text', content: 'text' }, options: { name: 'post_search_index' } },
  ],

  // Newsletter Subscribers indexes
  newslettersubscribers: [
    { fields: { email: 1 }, options: { unique: true, name: 'subscriber_email_unique' } },
    { fields: { subscribedAt: 1 }, options: { name: 'subscribed_date_index' } },
    { fields: { isActive: 1 }, options: { name: 'active_subscribers_index' } },
  ],

  // OTP collection indexes (with TTL)
  otps: [
    { fields: { email: 1 }, options: { name: 'otp_email_index' } },
    { fields: { purpose: 1 }, options: { name: 'otp_purpose_index' } },
    { fields: { expiresAt: 1 }, options: { expireAfterSeconds: 0, name: 'otp_ttl_index' } },
  ]
};

async function createIndexes() {
  try {
    console.log('🔍 Creating database indexes for optimal performance...');
    
    const { db } = await connectToDatabase();
    
    for (const [collectionName, collectionIndexes] of Object.entries(indexes)) {
      console.log(`\n📊 Creating indexes for collection: ${collectionName}`);
      
      const collection = db.collection(collectionName);
      
      for (const index of collectionIndexes) {
        try {
          const result = await collection.createIndex(index.fields, index.options);
          console.log(`✅ Created index "${index.options.name}" on ${collectionName}: ${result}`);
        } catch (error) {
          if (error.code === 85) {
            console.log(`⚠️  Index "${index.options.name}" already exists on ${collectionName}`);
          } else {
            console.error(`❌ Failed to create index "${index.options.name}" on ${collectionName}:`, error.message);
          }
        }
      }
    }
    
    console.log('\n🎉 Database indexing completed!');
    console.log('\n📈 Performance improvements:');
    console.log('   - Faster user lookups by email/username');
    console.log('   - Optimized problem searches and filtering');
    console.log('   - Efficient submission queries');
    console.log('   - Faster contest and leaderboard operations');
    console.log('   - Improved text search capabilities');
    console.log('   - Automatic cleanup of expired OTP tokens');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
}

async function analyzeIndexUsage() {
  try {
    console.log('📊 Analyzing current index usage...');
    
    const { db } = await connectToDatabase();
    
    for (const collectionName of Object.keys(indexes)) {
      console.log(`\n🔍 ${collectionName} collection indexes:`);
      
      const collection = db.collection(collectionName);
      const indexStats = await collection.indexes();
      
      for (const index of indexStats) {
        console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error analyzing indexes:', error);
  }
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'create':
    createIndexes();
    break;
  case 'analyze':
    analyzeIndexUsage();
    break;
  default:
    console.log('Usage: node scripts/create-indexes.js [create|analyze]');
    console.log('  create  - Create all performance indexes');
    console.log('  analyze - Show current index status');
    break;
}

export { createIndexes, analyzeIndexUsage };
