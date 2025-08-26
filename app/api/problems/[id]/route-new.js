import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../../utils/dbConnect';
import Problem from '../../../../models/Problem';
import { User } from '../../../../models/User';
import { SolvedProblem } from '../../../../models/SolvedProblem';
import { Submission } from '../../../../models/Submission';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const problemId = params.id;

    // Find problem by id, slug, or _id
    const problem = await Problem.findOne({
      $or: [
        { id: problemId },
        { slug: problemId },
        { _id: problemId.match(/^[0-9a-fA-F]{24}$/) ? problemId : null }
      ]
    }).lean();

    if (!problem) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Problem not found',
          details: `No problem found with identifier: ${problemId}`
        },
        { status: 404 }
      );
    }

    // Get user session and add user-specific data
    const session = await getServerSession(authOptions);
    let userContext = {
      solved: false,
      bookmarked: false,
      liked: false,
      mySubmissions: [],
      bestSubmission: null,
      attempts: 0
    };

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).lean();
      
      if (user) {
        // Check if problem is solved
        const solvedProblem = await SolvedProblem.findOne({
          userId: user._id,
          problemId: problem._id
        }).lean();

        // Get user's submissions for this problem
        const submissions = await Submission.find({
          userId: user._id,
          problemId: problem._id
        }).sort({ submittedAt: -1 }).lean();

        // Find best submission (Accepted with shortest time)
        const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
        const bestSubmission = acceptedSubmissions.length > 0 ? 
          acceptedSubmissions.reduce((best, current) => 
            (current.executionTime || 0) < (best.executionTime || Infinity) ? current : best
          ) : null;

        userContext = {
          solved: !!solvedProblem,
          bookmarked: (user.bookmarkedProblems || []).includes(problem._id.toString()),
          liked: (user.likedProblems || []).includes(problem._id.toString()),
          mySubmissions: submissions.map(sub => ({
            id: sub._id,
            status: sub.status,
            language: sub.language,
            submittedAt: sub.submittedAt,
            executionTime: sub.executionTime,
            memoryUsed: sub.memoryUsed,
            passed: sub.testCasesPassed || 0,
            total: sub.totalTestCases || 0
          })),
          bestSubmission: bestSubmission ? {
            language: bestSubmission.language,
            executionTime: bestSubmission.executionTime,
            memoryUsed: bestSubmission.memoryUsed,
            submittedAt: bestSubmission.submittedAt
          } : null,
          attempts: submissions.length
        };
      }
    }

    // Prepare problem data
    const problemData = {
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      description: problem.description,
      examples: problem.examples || [],
      constraints: problem.constraints || [],
      hints: problem.hints || [],
      
      // Company and topic info
      companies: problem.companies || [],
      topics: problem.topics || [],
      category: problem.category || 'General',
      
      // Stats
      totalSubmissions: problem.totalSubmissions || 0,
      acceptedSubmissions: problem.acceptedSubmissions || 0,
      acceptanceRate: problem.totalSubmissions > 0 ? 
        Math.round((problem.acceptedSubmissions / problem.totalSubmissions) * 100) : 0,
      
      // Difficulty rating
      likes: problem.likes || 0,
      dislikes: problem.dislikes || 0,
      
      // Template code for different languages
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
      },
      
      // Sample test cases (public only)
      sampleTestCases: (problem.testCases || []).slice(0, 3).map(tc => ({
        input: tc.input,
        output: tc.expectedOutput || tc.output,
        explanation: tc.explanation || ''
      })),
      
      // User-specific context
      userContext,
      
      // Related problems
      related: problem.related || [],
      
      // Solution approach hints
      approachHints: problem.approachHints || [],
      
      // Time and space complexity
      timeComplexity: problem.timeComplexity || 'O(n)',
      spaceComplexity: problem.spaceComplexity || 'O(1)'
    };

    return NextResponse.json({
      success: true,
      problem: problemData
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
