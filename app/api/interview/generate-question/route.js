import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  let mode, company, difficulty, questionHistory = [];
  
  try {
    ({ mode, company, difficulty, questionHistory = [] } = await request.json());

    if (!process.env.GEMINI_API_KEY) {
      console.log('Gemini API key not configured, using fallback questions');
      // Use fallback questions when API key is not available
      return getFallbackQuestion(mode, company, difficulty);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create context-specific prompts
    let systemPrompt = '';
    let questionPrompt = '';

    switch (mode) {
      case 'technical-coding':
        systemPrompt = `You are an expert technical interviewer conducting a coding interview${company !== 'general' ? ` for ${company}` : ''}. 
        Generate a ${difficulty || 'medium'} difficulty coding problem that is:
        1. Clear and well-structured
        2. Has optimal time/space complexity requirements
        3. Includes test cases and examples
        4. Appropriate for a ${company !== 'general' ? company + ' style' : 'general'} technical interview
        
        Avoid repeating these previously asked questions: ${questionHistory.join(', ')}`;

        questionPrompt = `Generate a coding interview question in this JSON format:
        {
          "title": "Problem Title",
          "difficulty": "${difficulty || 'Medium'}",
          "description": "Clear problem description",
          "examples": [
            {
              "input": "example input",
              "output": "example output",
              "explanation": "why this output"
            }
          ],
          "constraints": ["constraint 1", "constraint 2"],
          "hints": ["hint 1", "hint 2"],
          "expectedTimeComplexity": "O(n)",
          "expectedSpaceComplexity": "O(1)",
          "startingCode": {
            "javascript": "function solve() { \\n    // Your code here\\n}",
            "python": "def solve():\\n    # Your code here\\n    pass",
            "java": "public class Solution {\\n    public void solve() {\\n        // Your code here\\n    }\\n}"
          },
          "testCases": [
            {
              "input": "test input",
              "expected": "expected output"
            }
          ]
        }`;
        break;

      case 'system-design':
        systemPrompt = `You are an expert system design interviewer${company !== 'general' ? ` for ${company}` : ''}. 
        Generate a system design question that:
        1. Tests architectural thinking
        2. Requires scalability considerations
        3. Involves real-world constraints
        4. Is appropriate for a ${company !== 'general' ? company + ' style' : 'general'} system design interview
        
        Avoid repeating these previously asked questions: ${questionHistory.join(', ')}`;

        questionPrompt = `Generate a system design interview question in this JSON format:
        {
          "title": "Design Question Title",
          "difficulty": "${difficulty || 'Medium'}",
          "description": "System design challenge description",
          "requirements": ["functional requirement 1", "functional requirement 2"],
          "constraints": ["non-functional requirement 1", "non-functional requirement 2"],
          "scale": "Expected scale (users, requests, data size)",
          "keyComponents": ["component 1", "component 2"],
          "discussionPoints": ["scalability", "consistency", "availability"],
          "followUpQuestions": ["follow-up 1", "follow-up 2"]
        }`;
        break;

      case 'behavioral':
        systemPrompt = `You are an expert behavioral interviewer${company !== 'general' ? ` for ${company}` : ''}. 
        Generate a behavioral interview question that:
        1. Uses the STAR method framework
        2. Tests leadership, teamwork, or problem-solving skills
        3. Is relevant to software engineering roles
        4. Matches ${company !== 'general' ? company + ' leadership principles' : 'general best practices'}
        
        Avoid repeating these previously asked questions: ${questionHistory.join(', ')}`;

        questionPrompt = `Generate a behavioral interview question in this JSON format:
        {
          "title": "Behavioral Question",
          "category": "Leadership/Teamwork/Problem-solving",
          "description": "The main behavioral question",
          "followUp": ["follow-up question 1", "follow-up question 2"],
          "tips": ["STAR method tip", "what to focus on"],
          "lookingFor": ["quality 1 to demonstrate", "quality 2 to demonstrate"],
          "timeframe": "Recent example (within 2 years)"
        }`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid interview mode' },
          { status: 400 }
        );
    }

    const fullPrompt = `${systemPrompt}\n\n${questionPrompt}\n\nReturn only valid JSON without any markdown formatting or additional text.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/```$/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/```$/, '');
    }

    const question = JSON.parse(cleanedText);

    return NextResponse.json({
      success: true,
      question,
      metadata: {
        mode,
        company,
        difficulty,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating question:', error);

    // Fallback to mock questions on any error
    console.log('Falling back to mock questions due to error');
    return getFallbackQuestion(mode, company, difficulty);
  }
}

// Fallback function to provide mock questions when AI is not available
function getFallbackQuestion(mode, company, difficulty = 'medium') {
  const fallbackQuestions = {
    'technical-coding': [
      {
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
          }
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists."
        ],
        hints: [
          "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.",
          "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?",
          "The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?"
        ],
        expectedTimeComplexity: "O(n)",
        expectedSpaceComplexity: "O(n)",
        startingCode: {
          javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
          python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
          java: `public int[] twoSum(int[] nums, int target) {
    // Write your solution here
    
}`
        },
        testCases: [
          {
            input: "[2,7,11,15], 9",
            expected: "[0,1]"
          },
          {
            input: "[3,2,4], 6",
            expected: "[1,2]"
          }
        ]
      },
      {
        title: "Valid Parentheses",
        difficulty: "Easy",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets and in the correct order.",
        examples: [
          {
            input: 's = "()"',
            output: "true",
            explanation: "The string contains valid parentheses."
          },
          {
            input: 's = "()[]{}"',
            output: "true",
            explanation: "All brackets are properly closed."
          },
          {
            input: 's = "(]"',
            output: "false",
            explanation: "Brackets are not properly matched."
          }
        ],
        constraints: [
          "1 <= s.length <= 10^4",
          "s consists of parentheses only '()[]{}'."
        ],
        hints: [
          "An interesting property about a valid parenthesis expression is that a sub-expression of a valid expression should also be a valid expression.",
          "What if whenever we encounter a matching pair of parenthesis in the expression, we simply remove it from the expression?",
          "Use a stack of characters. When you encounter an opening bracket, push it to the top of the stack. When you encounter a closing bracket, check if the top of the stack was the opening for it. If yes, pop it from the stack. Otherwise, return false."
        ],
        expectedTimeComplexity: "O(n)",
        expectedSpaceComplexity: "O(n)",
        startingCode: {
          javascript: `function isValid(s) {
    // Write your solution here
    
}`,
          python: `def is_valid(s):
    # Write your solution here
    pass`,
          java: `public boolean isValid(String s) {
    // Write your solution here
    
}`
        },
        testCases: [
          {
            input: '"()"',
            expected: "true"
          },
          {
            input: '"()[]{}"',
            expected: "true"
          },
          {
            input: '"(]"',
            expected: "false"
          }
        ]
      }
    ],
    'system-design': [
      {
        title: "Design a URL Shortener",
        difficulty: "Medium",
        description: "Design a URL shortening service like bit.ly. The system should be able to shorten long URLs and redirect users when they access the short URL.",
        requirements: [
          "Shorten long URLs to a 6-character short URL",
          "Redirect to original URL when accessing short URL",
          "Handle 100M URLs per day",
          "Support custom aliases",
          "Analytics (click tracking)"
        ],
        constraints: [
          "System should be highly available",
          "URL redirection should happen in real-time with minimal latency",
          "Short URLs should not be guessable",
          "Support 100:1 read/write ratio"
        ],
        keyComponents: [
          "URL encoding service",
          "Database for URL mapping",
          "Cache layer for popular URLs",
          "Analytics service",
          "Load balancer"
        ],
        discussionPoints: [
          "Database choice (SQL vs NoSQL)",
          "Encoding algorithm (base62)",
          "Caching strategy",
          "Database partitioning",
          "Rate limiting"
        ],
        followUpQuestions: [
          "How would you handle database failures?",
          "How would you scale the system to handle 1B URLs?",
          "How would you implement analytics?",
          "What if we need to support custom domains?"
        ]
      }
    ],
    'behavioral': [
      {
        title: "Tell me about a time you had to work with a difficult team member",
        category: "Teamwork",
        description: "Describe a situation where you had to collaborate with someone who was challenging to work with. How did you handle the situation and what was the outcome?",
        followUp: [
          "How did you approach the initial conversation?",
          "What specific strategies did you use to improve the working relationship?",
          "What was the final outcome of the project?",
          "What would you do differently if faced with a similar situation?"
        ],
        tips: [
          "Use the STAR method (Situation, Task, Action, Result)",
          "Focus on your actions and problem-solving approach",
          "Show emotional intelligence and conflict resolution skills",
          "Demonstrate your ability to maintain professionalism"
        ],
        lookingFor: [
          "Communication skills",
          "Conflict resolution ability",
          "Team collaboration",
          "Leadership potential"
        ],
        timeframe: "Recent example (within 2 years)"
      }
    ]
  };

  const questions = fallbackQuestions[mode] || fallbackQuestions['technical-coding'];
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

  return NextResponse.json({
    success: true,
    question: randomQuestion,
    metadata: {
      mode,
      company,
      difficulty,
      generatedAt: new Date().toISOString(),
      source: 'fallback'
    }
  });
}
