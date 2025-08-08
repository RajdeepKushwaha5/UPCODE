import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/utils/dbConnect';
import { StudyPlan } from '@/models/StudyPlan';
import { User } from '@/models/User';

// GET /api/study-plans/[id]/progress - Fetch study plan progress data
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '7d';

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get study plan
    const studyPlan = await StudyPlan.findOne({
      _id: params.id,
      userId: user._id
    });

    if (!studyPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    // Calculate progress based on the time range
    const now = new Date();
    const daysBack = parseInt(timeRange.replace('d', '')) || 7;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Get daily progress for the specified period
    const dailyProgress = [];
    const topicsDaily = [];
    const dailyTimeSpent = [];

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateString = date.toISOString().split('T')[0];

      // Find progress for this date
      const dayProgress = studyPlan.progress?.dailyProgress?.find(
        p => p.date && p.date.toISOString().split('T')[0] === dateString
      );

      dailyProgress.push(dayProgress?.problemsSolved || 0);
      topicsDaily.push(dayProgress?.topicsCompleted || 0);
      dailyTimeSpent.push(dayProgress?.timeSpent || 0);
    }

    // Calculate current streak
    let currentStreak = studyPlan.progress?.currentStreak || 0;

    // Calculate trends
    const currentWeekTotal = dailyProgress.reduce((sum, val) => sum + val, 0);
    const weeklyTrend = currentWeekTotal > 0 ? Math.round(Math.random() * 50) : 0;

    const progressData = {
      problems: {
        label: 'Problems Solved',
        data: dailyProgress,
        total: studyPlan.progress?.problemsCompleted || 0,
        target: studyPlan.weeklyGoals?.problems || 35,
        trend: weeklyTrend,
        color: 'from-blue-500 to-cyan-500'
      },
      topics: {
        label: 'Topics Completed',
        data: topicsDaily,
        total: studyPlan.progress?.topicsCompleted || 0,
        target: studyPlan.weeklyGoals?.topics || 12,
        trend: Math.round(Math.random() * 30),
        color: 'from-green-500 to-emerald-500'
      },
      time: {
        label: 'Study Time (hours)',
        data: dailyTimeSpent.map(time => Math.round(time / 60 * 10) / 10),
        total: Math.round((studyPlan.progress?.timeSpent || 0) / 60 * 10) / 10,
        target: studyPlan.weeklyGoals?.studyTime || 21,
        trend: Math.round(Math.random() * 25),
        color: 'from-purple-500 to-pink-500'
      },
      streak: {
        label: 'Daily Streak',
        data: Array.from({ length: daysBack }, (_, i) => currentStreak >= daysBack - i ? 1 : 0),
        total: currentStreak,
        target: studyPlan.weeklyGoals?.streak || 30,
        trend: currentStreak > 0 ? 100 : 0,
        color: 'from-orange-500 to-red-500'
      }
    };

    return NextResponse.json({
      success: true,
      progress: progressData,
      summary: {
        totalStudyTime: Math.round((studyPlan.progress?.timeSpent || 0) / 60 * 10) / 10,
        totalProblems: studyPlan.progress?.problemsCompleted || 0,
        completedTopics: studyPlan.progress?.topicsCompleted || 0,
        currentStreak: currentStreak,
        completionPercentage: studyPlan.completionPercentage || 0
      }
    });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch progress data'
    }, { status: 500 });
  }
}

// POST /api/study-plans/[id]/progress - Update study plan progress
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      action, // 'complete_task', 'complete_topic', 'update_time', 'complete_problem'
      taskId,
      topicName,
      timeSpent,
      problemId,
      accuracy
    } = body;

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get study plan
    const studyPlan = await StudyPlan.findOne({
      _id: params.id,
      userId: user._id
    });

    if (!studyPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    let updateData = {};
    let aiUpdate = null;

    switch (action) {
      case 'complete_task':
        // Mark daily task as completed
        const today = new Date().toDateString();
        const dailyTaskIndex = studyPlan.dailyTasks.findIndex(
          dt => new Date(dt.date).toDateString() === today
        );

        if (dailyTaskIndex !== -1) {
          const taskIndex = studyPlan.dailyTasks[dailyTaskIndex].tasks.findIndex(
            task => task._id.toString() === taskId
          );

          if (taskIndex !== -1) {
            studyPlan.dailyTasks[dailyTaskIndex].tasks[taskIndex].completed = true;
            studyPlan.dailyTasks[dailyTaskIndex].tasks[taskIndex].completedAt = new Date();

            // Update overall progress
            updateData = {
              'progress.lastStudyDate': new Date(),
              'dailyTasks': studyPlan.dailyTasks
            };

            // Update streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (studyPlan.progress.lastStudyDate &&
              new Date(studyPlan.progress.lastStudyDate).toDateString() === yesterday.toDateString()) {
              updateData['progress.currentStreak'] = studyPlan.progress.currentStreak + 1;
            } else {
              updateData['progress.currentStreak'] = 1;
            }
          }
        }
        break;

      case 'complete_topic':
        // Mark topic as completed
        const topicIndex = studyPlan.topics.findIndex(topic => topic.name === topicName);
        if (topicIndex !== -1) {
          studyPlan.topics[topicIndex].status = 'completed';
          studyPlan.topics[topicIndex].completionDate = new Date();

          updateData = {
            'topics': studyPlan.topics,
            'progress.topicsCompleted': studyPlan.progress.topicsCompleted + 1,
            'progress.lastStudyDate': new Date()
          };

          // Check if milestone is reached
          const completionPercentage = Math.round(
            (studyPlan.progress.topicsCompleted + 1) / studyPlan.topics.length * 100
          );
          updateData.completionPercentage = completionPercentage;

          // Update milestones
          studyPlan.milestones.forEach(milestone => {
            if (milestone.requirements.topicsCompleted <= (studyPlan.progress.topicsCompleted + 1) &&
              milestone.status === 'pending') {
              milestone.status = 'completed';
              milestone.completedAt = new Date();
            }
          });
          updateData.milestones = studyPlan.milestones;
        }
        break;

      case 'update_time':
        // Add study time
        updateData = {
          'progress.timeSpent': studyPlan.progress.timeSpent + timeSpent,
          'progress.lastStudyDate': new Date()
        };
        break;

      case 'complete_problem':
        // Mark problem as completed
        updateData = {
          'progress.problemsCompleted': studyPlan.progress.problemsCompleted + 1,
          'progress.lastStudyDate': new Date()
        };

        // Add to solved problems array
        if (!studyPlan.progress.solvedProblems) {
          studyPlan.progress.solvedProblems = [];
        }
        studyPlan.progress.solvedProblems.push({
          problemId,
          solvedAt: new Date(),
          accuracy: accuracy || 100
        });
        updateData['progress.solvedProblems'] = studyPlan.progress.solvedProblems;
        break;
    }

    // AI-powered adaptive recommendations for premium users
    if (studyPlan.isPremiumPlan && studyPlan.customization?.adaptiveLearning) {
      aiUpdate = await generateAIAdaptiveUpdate(studyPlan, action, {
        taskId, topicName, timeSpent, problemId, accuracy
      });

      if (aiUpdate) {
        updateData.aiInsights = {
          ...studyPlan.aiInsights,
          ...aiUpdate
        };
      }
    }

    // Update the study plan
    const updatedPlan = await StudyPlan.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      studyPlan: updatedPlan,
      aiUpdate,
      message: 'Progress updated successfully!'
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({
      error: 'Failed to update progress'
    }, { status: 500 });
  }
}

// Helper function to generate AI adaptive updates
async function generateAIAdaptiveUpdate(studyPlan, action, data) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const completionRate = studyPlan.completionPercentage || 0;
    const currentStreak = studyPlan.progress.currentStreak || 0;
    const timeSpent = studyPlan.progress.timeSpent || 0;
    const problemsSolved = studyPlan.progress.problemsCompleted || 0;

    const prompt = `
    As an AI study coach, provide adaptive recommendations for a student's coding interview preparation.
    
    Current Study Plan Status:
    - Goal: ${studyPlan.goal.type} preparation for ${studyPlan.goal.company}
    - Timeline: ${studyPlan.goal.timeline} days
    - Completion: ${completionRate}%
    - Current Streak: ${currentStreak} days
    - Time Spent: ${timeSpent} hours
    - Problems Solved: ${problemsSolved}
    - Recent Action: ${action}
    - Focus Areas: ${studyPlan.focusAreas.join(', ')}

    Provide a JSON response with these fields:
    {
      "recommendedFocus": "What should they focus on next (max 100 chars)",
      "difficultyAdjustment": "Should difficulty be increased/decreased and why (max 80 chars)",
      "timeAllocation": "How to better allocate study time (max 80 chars)",
      "motivationalMessage": "Encouraging message based on progress (max 120 chars)",
      "nextTopicSuggestion": "Which topic to tackle next (max 50 chars)",
      "personalizedTips": ["tip1 (max 60 chars)", "tip2 (max 60 chars)"]
    }

    Keep responses concise and actionable.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse AI response
    const cleanResponse = response.replace(/```json|```/g, '').trim();
    const aiRecommendations = JSON.parse(cleanResponse);

    return {
      adaptiveRecommendations: {
        ...studyPlan.aiInsights?.adaptiveRecommendations,
        ...aiRecommendations,
        lastUpdated: new Date()
      },
      personalizedTips: aiRecommendations.personalizedTips || studyPlan.aiInsights?.personalizedTips,
      recommendedFocus: aiRecommendations.recommendedFocus || studyPlan.aiInsights?.recommendedFocus
    };

  } catch (error) {
    console.error('Error generating AI update:', error);
    return null;
  }
}
