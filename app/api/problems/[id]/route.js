import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import Problem from '../../../../models/Problem';
import { User } from '../../../../models/User';
import { SolvedProblem } from '../../../../models/SolvedProblem';
import { Submission } from '../../../../models/Submission';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const session = await getServerSession();

    // Get user session for personalized data
    let user = null;
    let userSolvedProblems = [];
    let userBookmarkedProblems = [];
    let userSubmissions = [];

    if (session?.user?.email) {
      try {
        user = await User.findOne({ email: session.user.email });
        if (user) {
          userBookmarkedProblems = user.bookmarkedProblems || [];
          
          // Get solved problems
          const solvedProblems = await SolvedProblem.find({ userId: user._id });
          userSolvedProblems = solvedProblems.map(sp => sp.problemId.toString());
          
          // Get user submissions for this problem
          userSubmissions = await Submission.find({ 
            userId: user._id, 
            problemId: id 
          }).sort({ submittedAt: -1 }).limit(10);
        }
      } catch (userError) {
        console.error('Error fetching user data:', userError);
      }
    }

    // Find the problem
    let problem = null;
    
    if (!isNaN(id)) {
      // If it's a number, search by id field
      problem = await Problem.findOne({ id: parseInt(id) }).lean();
    } else if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      // If it's a valid MongoDB ObjectId, search by _id
      problem = await Problem.findById(id).lean();
    } else {
      // Otherwise, search by slug
      problem = await Problem.findOne({ slug: id }).lean();
    }
    
    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Determine problem status for the user
    const problemId = problem._id.toString();
    let problemStatus = 'not-attempted';
    
    if (userSolvedProblems.includes(problemId)) {
      problemStatus = 'solved';
    } else if (userSubmissions.length > 0) {
      problemStatus = 'attempted';
    }

    // Transform problem data
    const transformedProblem = {
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      tags: problem.tags || [],
      companies: problem.companies || [],
      youtubeUrl: problem.youtubeUrl,
      description: problem.description,
      constraints: problem.constraints || [],
      examples: problem.examples || [],
      hints: problem.hints || [],
      status: problemStatus,
      acceptanceRate: problem.acceptanceRate || 0,
      likes: problem.likes || 0,
      dislikes: problem.dislikes || 0,
      category: problem.category,
      premium: problem.premium || false,
      hasEditorial: problem.hasEditorial || false,
      submissions: problem.submissions || 0,
      timeLimit: problem.timeLimit || 1000,
      memoryLimit: problem.memoryLimit || 256,
      isBookmarked: userBookmarkedProblems.includes(problemId),
      
      // Test cases - only show public ones
      testCases: (problem.testCases || []).filter(tc => tc.isPublic).map(tc => ({
        input: tc.input,
        output: tc.output,
        explanation: tc.explanation
      })),
      
      // Code templates
      codeTemplates: problem.codeTemplates || {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};`,
        python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`
      }
    };

    // Add user submission history if authenticated
    if (user && userSubmissions.length > 0) {
      transformedProblem.userSubmissions = userSubmissions.map(sub => ({
        id: sub._id,
        language: sub.language,
        status: sub.status,
        runtime: sub.runtime,
        memory: sub.memory,
        submittedAt: sub.submittedAt
      }));
    }

    return NextResponse.json({
      success: true,
      problem: transformedProblem
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
