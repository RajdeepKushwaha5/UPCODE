import { NextResponse } from 'next/server';
import { getAIKnowledge, getContextualHints } from '../../../lib/newProblemsData.js';

export async function POST(request) {
  try {
    const { problemId, userCode, question, context } = await request.json();

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    const aiKnowledge = getAIKnowledge(problemId);

    if (!aiKnowledge) {
      return NextResponse.json(
        { error: 'AI knowledge not available for this problem' },
        { status: 404 }
      );
    }

    let response = '';

    // Determine response type based on context
    if (context === 'hint') {
      response = generateHint(problemId, userCode, aiKnowledge);
    } else if (context === 'explanation') {
      response = aiKnowledge.conceptualExplanation;
    } else if (context === 'debug') {
      response = generateDebugHelp(problemId, userCode, aiKnowledge);
    } else if (context === 'approach') {
      response = generateApproachGuidance(aiKnowledge);
    } else if (question) {
      response = generateAnswerToQuestion(question, aiKnowledge, problemId);
    } else {
      response = generateGeneralHelp(aiKnowledge);
    }

    return NextResponse.json({
      success: true,
      response,
      problemId,
      context: context || 'general',
      additionalResources: {
        relatedConcepts: aiKnowledge.optimizationTechniques || [],
        debuggingTips: aiKnowledge.debuggingTips || [],
        testingStrategy: aiKnowledge.testingStrategy || []
      }
    });

  } catch (error) {
    console.error('AI Assistant error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

function generateHint(problemId, userCode, aiKnowledge) {
  if (!userCode || userCode.trim().length === 0) {
    return "I see you're just getting started! " + aiKnowledge.conceptualExplanation.split('.')[0] + ". Would you like me to explain the approach step by step?";
  }

  // Analyze user code for common patterns
  const codeAnalysis = analyzeUserCode(userCode, problemId);

  if (codeAnalysis.errorType) {
    return `I noticed something in your code: ${getContextualHints(problemId, userCode, codeAnalysis.errorType)} 

Here's a specific tip for your current approach: ${codeAnalysis.suggestion}`;
  }

  return `Your approach looks good! Here's a hint to help you move forward: ${aiKnowledge.stepByStepApproach[Math.floor(Math.random() * aiKnowledge.stepByStepApproach.length)]}`;
}

function generateDebugHelp(problemId, userCode, aiKnowledge) {
  const debugTips = aiKnowledge.debuggingTips;
  const codeAnalysis = analyzeUserCode(userCode, problemId);

  let response = "Let's debug your code together! Here are some things to check:\n\n";

  if (codeAnalysis.issues.length > 0) {
    response += "**Potential Issues I Found:**\n";
    codeAnalysis.issues.forEach((issue, index) => {
      response += `${index + 1}. ${issue}\n`;
    });
    response += "\n";
  }

  response += "**General Debugging Tips:**\n";
  debugTips.forEach((tip, index) => {
    response += `${index + 1}. ${tip}\n`;
  });

  return response;
}

function generateApproachGuidance(aiKnowledge) {
  let response = "Here's a step-by-step approach to solve this problem:\n\n";

  aiKnowledge.stepByStepApproach.forEach((step, index) => {
    response += `**Step ${index + 1}:** ${step}\n\n`;
  });

  response += "\n**Key Insights:**\n";
  if (aiKnowledge.optimizationTechniques) {
    aiKnowledge.optimizationTechniques.forEach((technique, index) => {
      response += `• ${technique}\n`;
    });
  }

  return response;
}

function generateAnswerToQuestion(question, aiKnowledge, problemId) {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('time complexity') || lowerQuestion.includes('complexity')) {
    return "Great question about complexity! For this problem:\n\n" +
      "• **Time Complexity:** The optimal solution runs in O(n) time\n" +
      "• **Space Complexity:** O(n) for the hash map storage\n\n" +
      "The key insight is trading space for time efficiency. " +
      aiKnowledge.optimizationTechniques?.[0] || "";
  }

  if (lowerQuestion.includes('approach') || lowerQuestion.includes('how to')) {
    return aiKnowledge.conceptualExplanation + "\n\n" +
      "Here's the step-by-step approach:\n\n" +
      aiKnowledge.stepByStepApproach.map((step, i) => `${i + 1}. ${step}`).join('\n');
  }

  if (lowerQuestion.includes('hint') || lowerQuestion.includes('stuck')) {
    return "No worries, here's a hint to get you unstuck:\n\n" +
      aiKnowledge.stepByStepApproach[0] + "\n\n" +
      "Try implementing just this first step and let me know how it goes!";
  }

  if (lowerQuestion.includes('test') || lowerQuestion.includes('example')) {
    return "Let's work through an example together!\n\n" +
      aiKnowledge.testingStrategy.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n');
  }

  // Default response
  return "That's a great question! " + aiKnowledge.conceptualExplanation.split('.')[0] +
    ". Would you like me to explain any specific part in more detail?";
}

function generateGeneralHelp(aiKnowledge) {
  return `I'm here to help you solve this problem! Here's what I can assist you with:

**🎯 Conceptual Understanding:**
${aiKnowledge.conceptualExplanation.split('.').slice(0, 2).join('.')}

**💡 What I can help with:**
• Explain the approach step-by-step
• Provide hints when you're stuck
• Help debug your code
• Answer specific questions about complexity or implementation
• Guide you through test cases

**🚀 Ready to start?**
Try asking me:
• "How should I approach this problem?"
• "I'm stuck, can you give me a hint?"
• "Can you help me debug my code?"
• "What's the time complexity?"

Just let me know what you need help with!`;
}

function analyzeUserCode(userCode, problemId) {
  const issues = [];
  let errorType = null;
  let suggestion = '';

  if (!userCode || userCode.trim().length === 0) {
    return { issues: [], errorType: null, suggestion: '' };
  }

  const code = userCode.toLowerCase();

  // Problem-specific analysis
  if (problemId === 'two-sum-realtime') {
    if (code.includes('for') && code.split('for').length > 2) {
      errorType = 'nested-loops';
      issues.push('You might be using nested loops, which gives O(n²) complexity');
      suggestion = 'Consider using a hash map to achieve O(n) time complexity';
    } else if (!code.includes('map') && !code.includes('dict') && !code.includes('hash')) {
      errorType = 'no-hash-map';
      issues.push('Consider using a hash map for efficient lookups');
      suggestion = 'Hash maps provide O(1) average lookup time for complements';
    }
  } else if (problemId === 'valid-parentheses') {
    if (!code.includes('stack') && !code.includes('push') && !code.includes('pop')) {
      errorType = 'no-stack';
      issues.push('This problem is ideal for a stack data structure');
      suggestion = 'Use a stack to keep track of opening brackets';
    }
  } else if (problemId === 'merge-two-sorted-lists') {
    if (!code.includes('dummy')) {
      errorType = 'no-dummy';
      issues.push('Consider using a dummy node to simplify your code');
      suggestion = 'A dummy node eliminates special cases for the first node';
    }
  }

  // General code analysis
  if (code.includes('todo') || code.includes('your code here')) {
    issues.push('Replace the placeholder comments with your implementation');
  }

  return { issues, errorType, suggestion };
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Assistant for coding problems',
    features: [
      'Contextual hints based on your code',
      'Step-by-step guidance',
      'Debug assistance',
      'Complexity analysis',
      'Problem-specific explanations'
    ],
    supportedProblems: ['two-sum-realtime', 'valid-parentheses', 'merge-two-sorted-lists'],
    status: 'active'
  });
}
