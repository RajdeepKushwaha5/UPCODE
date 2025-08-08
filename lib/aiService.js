/**
 * AI Service for Problem Solving Assistance
 * Supports both Gemini AI and OpenAI with fallback to mock responses
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.provider = process.env.AI_SERVICE_PROVIDER || 'mock';
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    
    // Initialize Gemini client
    if (this.geminiApiKey && this.provider === 'gemini') {
      this.geminiClient = new GoogleGenerativeAI(this.geminiApiKey);
      this.geminiModel = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  /**
   * Generate AI response for coding problem assistance
   */
  async generateResponse(message, problemContext = {}, userContext = {}) {
    try {
      switch (this.provider) {
        case 'gemini':
          return await this.geminiResponse(message, problemContext, userContext);
        case 'openai':
          return await this.openaiResponse(message, problemContext, userContext);
        default:
          return this.mockResponse(message, problemContext);
      }
    } catch (error) {
      console.error('AI Service error:', error);
      // Fallback to mock response
      return this.mockResponse(message, problemContext);
    }
  }

  /**
   * Generate response using Gemini AI
   */
  async geminiResponse(message, problemContext, userContext) {
    if (!this.geminiClient) {
      throw new Error('Gemini API not configured');
    }

    const prompt = this.buildSystemPrompt(message, problemContext, userContext);
    
    const result = await this.geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      response: text,
      provider: 'gemini'
    };
  }

  /**
   * Generate response using OpenAI
   */
  async openaiResponse(message, problemContext, userContext) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = this.buildSystemPrompt(message, problemContext, userContext);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.openaiModel,
        messages: [
          {
            role: 'system',
            content: `You are an expert coding tutor helping students solve programming problems. Be helpful, encouraging, and provide hints rather than complete solutions.`
          },
          {
            role: 'user',
            content: systemPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      response: data.choices[0].message.content,
      provider: 'openai'
    };
  }

  /**
   * Build comprehensive prompt for AI services
   */
  buildSystemPrompt(message, problemContext, userContext) {
    let prompt = `You are helping a student with a coding problem. Here's the context:

PROBLEM INFORMATION:
- Title: ${problemContext.title || 'Unknown Problem'}
- Difficulty: ${problemContext.difficulty || 'Unknown'}
- Topics: ${problemContext.tags ? problemContext.tags.join(', ') : 'Not specified'}
- Description: ${problemContext.description || 'Not provided'}

USER CONTEXT:
- Premium User: ${userContext.isPremium ? 'Yes' : 'No'}
- Previous Attempts: ${userContext.attempts || 0}
- Skill Level: ${userContext.skillLevel || 'Beginner'}

STUDENT'S QUESTION/MESSAGE:
"${message}"

GUIDELINES:
1. ${userContext.isPremium ? 'Provide detailed explanations and step-by-step solutions.' : 'Give hints and guidance without revealing the complete solution.'}
2. Be encouraging and supportive
3. Ask clarifying questions if needed
4. Explain concepts clearly
5. Suggest relevant algorithms or data structures
6. Help with debugging if code is provided
7. Keep responses concise but helpful

Please provide a helpful response:`;

    return prompt;
  }

  /**
   * Mock response for development/fallback
   */
  mockResponse(message, problemContext) {
    const messageText = message.toLowerCase();
    
    // Context-aware responses based on problem
    const problemType = this.detectProblemType(problemContext);
    
    if (messageText.includes('hint') || messageText.includes('help')) {
      return {
        success: true,
        response: this.getHintResponse(problemType, problemContext),
        provider: 'mock'
      };
    }
    
    if (messageText.includes('debug') || messageText.includes('error') || messageText.includes('wrong')) {
      return {
        success: true,
        response: this.getDebugResponse(problemType),
        provider: 'mock'
      };
    }
    
    if (messageText.includes('approach') || messageText.includes('how') || messageText.includes('solve')) {
      return {
        success: true,
        response: this.getApproachResponse(problemType, problemContext),
        provider: 'mock'
      };
    }
    
    if (messageText.includes('complexity') || messageText.includes('time') || messageText.includes('space')) {
      return {
        success: true,
        response: this.getComplexityResponse(problemType),
        provider: 'mock'
      };
    }
    
    // Default contextual response
    return {
      success: true,
      response: this.getDefaultResponse(message, problemContext),
      provider: 'mock'
    };
  }

  /**
   * Detect problem type from context
   */
  detectProblemType(problemContext) {
    const tags = problemContext.tags || [];
    const title = (problemContext.title || '').toLowerCase();
    
    if (tags.includes('Array') || title.includes('array')) return 'array';
    if (tags.includes('String') || title.includes('string')) return 'string';
    if (tags.includes('Dynamic Programming') || tags.includes('DP')) return 'dp';
    if (tags.includes('Tree') || tags.includes('Binary Tree')) return 'tree';
    if (tags.includes('Graph') || tags.includes('BFS') || tags.includes('DFS')) return 'graph';
    if (tags.includes('LinkedList') || title.includes('linked')) return 'linkedlist';
    if (tags.includes('Binary Search')) return 'binarysearch';
    if (tags.includes('Two Pointers')) return 'twopointer';
    
    return 'general';
  }

  /**
   * Generate hint responses based on problem type
   */
  getHintResponse(problemType, problemContext) {
    const hints = {
      array: [
        "Consider using two pointers to traverse the array efficiently.",
        "Think about what happens if you sort the array first.",
        "Can you solve this with a single pass through the array?",
        "Consider using a hash map to store values you've seen."
      ],
      string: [
        "Try using two pointers from the beginning and end of the string.",
        "Consider using a sliding window approach.",
        "Think about using a hash map to count character frequencies.",
        "Can you solve this by comparing characters one by one?"
      ],
      dp: [
        "Start by identifying the base cases for your recursive solution.",
        "Think about what subproblems you need to solve first.",
        "Consider whether this is a 1D or 2D DP problem.",
        "Can you identify the recurrence relation?"
      ],
      tree: [
        "Consider using recursion to traverse the tree.",
        "Think about whether you need DFS (in-order, pre-order, post-order) or BFS.",
        "Can you solve this by comparing left and right subtrees?",
        "Consider what information you need to pass up from child nodes."
      ],
      graph: [
        "Think about whether you need DFS or BFS for this problem.",
        "Consider using a visited set to avoid cycles.",
        "Can you model this as finding connected components?",
        "Think about whether you need to track the path or just the result."
      ],
      general: [
        `For this ${problemContext.difficulty || 'medium'} problem, start with a brute force approach.`,
        "Break the problem down into smaller, manageable parts.",
        "Think about the constraints - what do they tell you about the expected solution?",
        "Consider edge cases and how your solution handles them."
      ]
    };
    
    const typeHints = hints[problemType] || hints.general;
    return typeHints[Math.floor(Math.random() * typeHints.length)];
  }

  /**
   * Generate debugging responses
   */
  getDebugResponse(problemType) {
    const responses = [
      "Let me help you debug this. Can you show me your code and describe what's happening?",
      "Debugging tip: Add print statements to see what values your variables have at each step.",
      "Check your edge cases - empty inputs, single elements, or boundary conditions.",
      "Make sure your loop conditions are correct - are you going out of bounds?",
      "Verify that you're handling the return statement correctly.",
      "Consider tracing through your algorithm with a small example input."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Generate approach responses
   */
  getApproachResponse(problemType, problemContext) {
    const approaches = {
      array: "For array problems, consider sorting, two pointers, or hash maps.",
      string: "String problems often use sliding window, two pointers, or character mapping.",
      dp: "Dynamic programming problems benefit from identifying subproblems and building up solutions.",
      tree: "Tree problems typically use recursion with proper base cases.",
      graph: "Graph problems usually need BFS/DFS with proper visited tracking.",
      general: `This ${problemContext.difficulty || 'medium'} problem can likely be solved with a step-by-step approach.`
    };
    
    return approaches[problemType] || approaches.general;
  }

  /**
   * Generate complexity responses
   */
  getComplexityResponse(problemType) {
    const responses = [
      "Aim for O(n) time complexity if possible, O(n log n) is often acceptable too.",
      "Consider whether you can trade space for time - sometimes O(n) space gives you O(n) time.",
      "The optimal solution likely avoids nested loops unless necessary.",
      "Think about whether binary search could reduce your time complexity."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Generate default contextual response
   */
  getDefaultResponse(message, problemContext) {
    return `I understand you're asking about "${message}". For this ${problemContext.difficulty || 'medium'} problem, I'd be happy to help! You can ask me for:

• Hints to get you started
• Help debugging your code  
• Suggestions for different approaches
• Complexity analysis
• Edge cases to consider

What specific aspect would you like help with?`;
  }

  /**
   * Test AI service connection
   */
  async testConnection() {
    try {
      const testResponse = await this.generateResponse(
        "Test connection", 
        { title: "Test Problem", difficulty: "Easy" },
        { isPremium: false }
      );
      return testResponse.success;
    } catch (error) {
      console.error('AI service connection test failed:', error);
      return false;
    }
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      provider: this.provider,
      geminiConfigured: !!this.geminiApiKey,
      openaiConfigured: !!this.openaiApiKey,
      isProduction: this.provider !== 'mock'
    };
  }
}

export default AIService;
