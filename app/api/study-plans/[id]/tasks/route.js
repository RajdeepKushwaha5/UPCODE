import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/utils/dbConnect';
import { StudyPlan } from '@/models/StudyPlan';
import { User } from '@/models/User';

// GET /api/study-plans/[id]/tasks - Get daily tasks for a study plan
export async function GET(request, { params }) {
  try {
    console.log('GET /api/study-plans/[id]/tasks - Starting...');

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const studyPlan = await StudyPlan.findOne({
      _id: params.id,
      userId: user._id
    });

    if (!studyPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    // Generate daily tasks based on current progress and study plan
    const dailyTasks = generateDailyTasks(studyPlan);

    return NextResponse.json({
      success: true,
      tasks: dailyTasks,
      studyPlanId: studyPlan._id,
      currentDay: studyPlan.progress?.currentDay || 1,
      currentWeek: studyPlan.progress?.currentWeek || 1
    });

  } catch (error) {
    console.error('Error fetching daily tasks:', error);
    return NextResponse.json({
      error: 'Failed to fetch daily tasks'
    }, { status: 500 });
  }
}

// POST /api/study-plans/[id]/tasks - Update task completion
export async function POST(request, { params }) {
  try {
    console.log('POST /api/study-plans/[id]/tasks - Starting...');

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, completed, timeSpent } = body;

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const studyPlan = await StudyPlan.findOne({
      _id: params.id,
      userId: user._id
    });

    if (!studyPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    // Update progress based on task completion
    if (completed) {
      studyPlan.progress.problemsCompleted += 1;

      // Update streak
      const today = new Date();
      const lastActive = studyPlan.progress.lastActiveDate;
      const daysDiff = lastActive ? Math.floor((today - lastActive) / (1000 * 60 * 60 * 24)) : 0;

      if (daysDiff === 0) {
        // Same day, maintain streak
      } else if (daysDiff === 1) {
        // Next day, increment streak
        studyPlan.progress.currentStreak += 1;
        studyPlan.progress.longestStreak = Math.max(
          studyPlan.progress.longestStreak,
          studyPlan.progress.currentStreak
        );
      } else {
        // Broke streak
        studyPlan.progress.currentStreak = 1;
      }

      studyPlan.progress.lastActiveDate = today;
    }

    await studyPlan.save();

    // Return updated study plan data
    const updatedTasks = generateDailyTasks(studyPlan);

    return NextResponse.json({
      success: true,
      message: completed ? 'Task completed!' : 'Task updated!',
      tasks: updatedTasks,
      progress: studyPlan.progress
    });

  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({
      error: 'Failed to update task'
    }, { status: 500 });
  }
}

// Helper function to generate daily tasks based on study plan progress
function generateDailyTasks(studyPlan) {
  const currentDay = studyPlan.progress?.currentDay || 1;
  const currentWeek = studyPlan.progress?.currentWeek || 1;
  const topics = studyPlan.topics || [];

  // Get current topic based on progress
  const currentTopicIndex = Math.floor((currentDay - 1) / 7); // One topic per week
  const currentTopic = topics[currentTopicIndex] || topics[0];

  if (!currentTopic) {
    return [];
  }

  const tasks = [];
  const dayInWeek = ((currentDay - 1) % 7) + 1;

  // Generate tasks for current day
  switch (dayInWeek) {
    case 1: // Monday - Theory
      tasks.push({
        id: `${studyPlan._id}_${currentDay}_theory`,
        title: `${currentTopic.name} - Concept Review`,
        description: `Study the fundamental concepts and patterns for ${currentTopic.name}`,
        type: "theory",
        difficulty: "Easy",
        estimatedTime: Math.floor(studyPlan.timeAvailability.hoursPerDay * 0.5 * 60),
        completed: false,
        priority: "high",
        topicId: currentTopic._id,
        resources: currentTopic.resources || [],
        aiTip: `Focus on understanding the core concepts before moving to implementation`
      });
      break;

    case 2: // Tuesday - Easy Practice
    case 3: // Wednesday - Easy Practice
      tasks.push({
        id: `${studyPlan._id}_${currentDay}_practice_easy`,
        title: `${currentTopic.name} - Easy Problems`,
        description: `Solve 2-3 easy problems to build foundational understanding`,
        type: "practice",
        difficulty: "Easy",
        estimatedTime: Math.floor(studyPlan.timeAvailability.hoursPerDay * 0.8 * 60),
        completed: false,
        priority: "high",
        topicId: currentTopic._id,
        problems: [`Easy ${currentTopic.name} Problem 1`, `Easy ${currentTopic.name} Problem 2`],
        aiTip: "Focus on understanding the pattern rather than speed"
      });
      break;

    case 4: // Thursday - Medium Practice
    case 5: // Friday - Medium Practice
      tasks.push({
        id: `${studyPlan._id}_${currentDay}_practice_medium`,
        title: `${currentTopic.name} - Medium Problems`,
        description: `Challenge yourself with 1-2 medium difficulty problems`,
        type: "practice",
        difficulty: "Medium",
        estimatedTime: Math.floor(studyPlan.timeAvailability.hoursPerDay * 0.9 * 60),
        completed: false,
        priority: "medium",
        topicId: currentTopic._id,
        problems: [`Medium ${currentTopic.name} Problem 1`],
        aiTip: "Take time to optimize your solution and consider edge cases"
      });
      break;

    case 6: // Saturday - Review & Hard Problem
      tasks.push({
        id: `${studyPlan._id}_${currentDay}_review`,
        title: `${currentTopic.name} - Week Review`,
        description: `Review the week's learning and attempt a challenging problem`,
        type: "review",
        difficulty: "Hard",
        estimatedTime: Math.floor(studyPlan.timeAvailability.hoursPerDay * 60),
        completed: false,
        priority: "medium",
        topicId: currentTopic._id,
        problems: [`Hard ${currentTopic.name} Challenge`],
        aiTip: "Reflect on patterns learned this week and how they connect"
      });
      break;

    case 7: // Sunday - Mock Interview or Rest
      if (studyPlan.goal.type === 'interview') {
        tasks.push({
          id: `${studyPlan._id}_${currentDay}_interview`,
          title: `${currentTopic.name} - Mock Interview`,
          description: `Practice explaining your approach in an interview setting`,
          type: "interview",
          difficulty: "Medium",
          estimatedTime: Math.floor(studyPlan.timeAvailability.hoursPerDay * 60),
          completed: false,
          priority: "low",
          topicId: currentTopic._id,
          problems: [`Interview ${currentTopic.name} Question`],
          aiTip: "Practice articulating your thought process clearly"
        });
      }
      break;
  }

  // Add optional tasks if user has more time
  if (studyPlan.timeAvailability.hoursPerDay > 2) {
    tasks.push({
      id: `${studyPlan._id}_${currentDay}_bonus`,
      title: "Bonus Challenge",
      description: "Additional practice problem for extra learning",
      type: "bonus",
      difficulty: "Medium",
      estimatedTime: 30,
      completed: false,
      priority: "low",
      topicId: currentTopic._id,
      problems: ["Bonus Problem"],
      aiTip: "Optional challenge to deepen your understanding"
    });
  }

  return tasks;
}
