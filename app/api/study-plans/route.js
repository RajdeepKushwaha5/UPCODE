import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/utils/dbConnect';
import { StudyPlan } from '@/models/StudyPlan';
import { User } from '@/models/User';

// GET /api/study-plans - Get all study plans for user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all study plans for user
    const studyPlans = await StudyPlan.find({ userId: user._id })
      .sort({ createdAt: -1 });

    // Find active study plan
    const activeStudyPlan = studyPlans.find(plan => plan.status === 'active') || null;

    // Calculate stats
    const stats = {
      totalPlans: studyPlans.length,
      completedPlans: studyPlans.filter(plan => plan.status === 'completed').length,
      currentStreak: activeStudyPlan?.progress?.currentStreak || 0,
      totalProblemsCompleted: studyPlans.reduce((total, plan) => total + (plan.progress?.problemsCompleted || 0), 0)
    };

    return NextResponse.json({
      success: true,
      studyPlans,
      activeStudyPlan,
      stats
    });

  } catch (error) {
    console.error('Error fetching study plans:', error);
    return NextResponse.json({
      error: 'Failed to fetch study plans'
    }, { status: 500 });
  }
}

// POST /api/study-plans - Create new study plan
export async function POST(request) {
  try {
    console.log('POST /api/study-plans - Starting...');

    const session = await getServerSession(authOptions);
    console.log('Session:', session?.user?.email);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    const { goal, timeAvailability, focusAreas, customization } = body;

    await dbConnect();
    console.log('Database connected successfully');

    // Find user
    const user = await User.findOne({ email: session.user.email });
    console.log('User found:', user ? user.email : 'User not found');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Checking premium features...');

    // Check if user has premium for premium features
    const isPremiumPlan = customization?.aiPersonalization ||
      customization?.adaptiveLearning ||
      customization?.mentorship ||
      (focusAreas && focusAreas.length > 3);

    console.log('isPremiumPlan:', isPremiumPlan, 'user.isPremium:', user.isPremium);

    if (isPremiumPlan && !user.isPremium) {
      return NextResponse.json({
        error: 'Premium subscription required for advanced features',
        requiresPremium: true
      }, { status: 403 });
    }

    console.log('Generating study plan structure...');
    // Generate study plan structure
    const studyPlanData = await generateStudyPlanStructure({
      goal,
      timeAvailability,
      focusAreas,
      customization,
      userLevel: user.level || 'beginner',
      isPremium: user.isPremium
    });

    console.log('Study plan data generated:', {
      topicsCount: studyPlanData.topics.length,
      hasAiInsights: !!studyPlanData.aiInsights
    });

    console.log('Creating StudyPlan instance...');
    // Create study plan
    const studyPlan = new StudyPlan({
      userId: user._id,
      title: `${goal.type === 'interview' ? 'Interview Prep' : 'Skill Building'} - ${goal.company || 'General'}`,
      goal,
      timeAvailability,
      isPremiumPlan,
      topics: studyPlanData.topics,
      progress: {
        totalProblemsAssigned: studyPlanData.topics.reduce((total, topic) => total + (topic.problems ? topic.problems.length : 0), 0),
        problemsCompleted: 0,
        topicsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyGoals: [],
        lastActiveDate: new Date()
      },
      aiInsights: isPremiumPlan ? studyPlanData.aiInsights : {
        strongAreas: [],
        weakAreas: [],
        recommendedFocus: '',
        adaptationHistory: [],
        nextRecommendations: []
      }
    });

    console.log('Saving StudyPlan to database...');
    await studyPlan.save();
    console.log('StudyPlan saved successfully with ID:', studyPlan._id);

    return NextResponse.json({
      success: true,
      studyPlan,
      message: 'Study plan created successfully!'
    });

  } catch (error) {
    console.error('Error creating study plan:', error);
    return NextResponse.json({
      error: 'Failed to create study plan'
    }, { status: 500 });
  }
}

// Helper function to generate study plan structure
async function generateStudyPlanStructure({ goal, timeAvailability, focusAreas, customization, userLevel, isPremium }) {
  console.log('generateStudyPlanStructure called with:', {
    goalType: goal?.type,
    company: goal?.company,
    timeline: goal?.timeline,
    hoursPerDay: timeAvailability?.hoursPerDay,
    focusAreasCount: focusAreas?.length
  });

  const topics = [];

  // Base topics based on goal type and company
  const baseTopics = {
    'interview': {
      'Google': [
        { name: 'Arrays & Strings', difficulty: 'Easy', estimatedHours: 8, problems: 15 },
        { name: 'Two Pointers', difficulty: 'Easy', estimatedHours: 6, problems: 10 },
        { name: 'Hash Tables', difficulty: 'Medium', estimatedHours: 8, problems: 12 },
        { name: 'Trees & Graphs', difficulty: 'Medium', estimatedHours: 12, problems: 20 },
        { name: 'Dynamic Programming', difficulty: 'Hard', estimatedHours: 15, problems: 18 },
        { name: 'System Design Basics', difficulty: 'Medium', estimatedHours: 10, problems: 5 }
      ],
      'Amazon': [
        { name: 'Arrays & Strings', difficulty: 'Easy', estimatedHours: 8, problems: 15 },
        { name: 'Linked Lists', difficulty: 'Easy', estimatedHours: 6, problems: 10 },
        { name: 'Trees & Recursion', difficulty: 'Medium', estimatedHours: 10, problems: 15 },
        { name: 'Dynamic Programming', difficulty: 'Hard', estimatedHours: 12, problems: 15 },
        { name: 'Leadership Principles', difficulty: 'Medium', estimatedHours: 8, problems: 0 }
      ],
      'General': [
        { name: 'Arrays & Strings', difficulty: 'Easy', estimatedHours: 8, problems: 15 },
        { name: 'Two Pointers & Sliding Window', difficulty: 'Easy', estimatedHours: 8, problems: 12 },
        { name: 'Hash Tables & Sets', difficulty: 'Medium', estimatedHours: 6, problems: 10 },
        { name: 'Trees & Binary Search', difficulty: 'Medium', estimatedHours: 10, problems: 15 },
        { name: 'Dynamic Programming', difficulty: 'Hard', estimatedHours: 12, problems: 15 }
      ]
    },
    'contest': [
      { name: 'Math & Number Theory', difficulty: 'Medium', estimatedHours: 10, problems: 20 },
      { name: 'Graph Algorithms', difficulty: 'Hard', estimatedHours: 15, problems: 18 },
      { name: 'Advanced Data Structures', difficulty: 'Hard', estimatedHours: 12, problems: 15 },
      { name: 'Greedy Algorithms', difficulty: 'Medium', estimatedHours: 8, problems: 12 }
    ],
    'skill_improvement': [
      { name: 'Problem Solving Patterns', difficulty: 'Easy', estimatedHours: 10, problems: 25 },
      { name: 'Time & Space Complexity', difficulty: 'Medium', estimatedHours: 6, problems: 8 },
      { name: 'Code Optimization', difficulty: 'Medium', estimatedHours: 8, problems: 10 },
      { name: 'Debugging Techniques', difficulty: 'Easy', estimatedHours: 4, problems: 5 }
    ]
  };

  // Get relevant topics
  const relevantTopics = baseTopics[goal.type]?.[goal.company] || baseTopics[goal.type] || baseTopics['skill_improvement'];

  // Filter by focus areas if specified
  if (focusAreas && focusAreas.length > 0) {
    relevantTopics.forEach((topic, index) => {
      const matches = focusAreas.some(area =>
        topic.name.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes(topic.name.toLowerCase())
      );
      if (matches || focusAreas.includes('All Topics')) {
        topics.push({
          name: topic.name,
          category: topic.name.split(' ')[0], // Use first word as category
          order: index + 1,
          estimatedDays: Math.ceil(topic.estimatedHours / timeAvailability.hoursPerDay),
          problems: [], // Empty array, will be populated later
          resources: [
            {
              type: 'article',
              title: `${topic.name} - Study Guide`,
              url: '#',
              description: `Comprehensive guide for ${topic.name}`,
              isCompleted: false
            }
          ],
          quiz: {
            questions: [],
            isCompleted: false,
            score: 0
          },
          isCompleted: false
        });
      }
    });
  } else {
    topics.push(...relevantTopics.map((topic, index) => ({
      name: topic.name,
      category: topic.name.split(' ')[0], // Use first word as category
      order: index + 1,
      estimatedDays: Math.ceil(topic.estimatedHours / timeAvailability.hoursPerDay),
      problems: [], // Empty array, will be populated later
      resources: [
        {
          type: 'article',
          title: `${topic.name} - Study Guide`,
          url: '#',
          description: `Comprehensive guide for ${topic.name}`,
          isCompleted: false
        }
      ],
      quiz: {
        questions: [],
        isCompleted: false,
        score: 0
      },
      isCompleted: false
    })));
  }

  // AI Insights for premium users
  let aiInsights = {
    strongAreas: [],
    weakAreas: [],
    recommendedFocus: `Based on your ${goal.type} goal and ${goal.timeline}-day timeline, focus on mastering ${topics[0]?.name || 'foundational topics'} first.`,
    adaptationHistory: [],
    nextRecommendations: [
      "Start with easier problems to build confidence",
      "Take breaks every 45 minutes to maintain focus",
      "Review solutions and understand patterns"
    ]
  };

  if (isPremium && customization.aiPersonalization) {
    aiInsights.nextRecommendations.push(
      `Spend ${Math.round(timeAvailability.hoursPerDay * 0.7)}h on practice, ${Math.round(timeAvailability.hoursPerDay * 0.3)}h on theory`,
      `Complete ${Math.ceil(topics.length / (goal.timeline / 7))} topics this week`,
      "Maintain daily study streak"
    );
  }

  return {
    topics,
    aiInsights
  };
}
