import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const {
      mode,
      userResponse,
      currentQuestion,
      codeSubmission,
      language
    } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      console.log('Gemini API key not configured, using fallback evaluation');
      return getFallbackEvaluation(mode, userResponse, currentQuestion, codeSubmission, language);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let evaluationPrompt = '';

    switch (mode) {
      case 'technical-coding':
        evaluationPrompt = `
        You are an expert technical interviewer evaluating a coding solution.
        
        QUESTION: ${JSON.stringify(currentQuestion)}
        LANGUAGE: ${language}
        CODE SUBMISSION: 
        \`\`\`${language}
        ${codeSubmission}
        \`\`\`
        
        Evaluate this solution and provide feedback in this JSON format:
        {
          "score": number between 0-100,
          "correctness": "correct|partially_correct|incorrect",
          "timeComplexity": "actual time complexity",
          "spaceComplexity": "actual space complexity",
          "feedback": {
            "positive": ["strength 1", "strength 2"],
            "improvements": ["improvement 1", "improvement 2"],
            "bugs": ["bug 1", "bug 2"] or null if no bugs
          },
          "testResults": [
            {
              "input": "test case",
              "expected": "expected output",
              "actual": "actual output",
              "passed": true/false
            }
          ],
          "suggestions": ["suggestion 1", "suggestion 2"],
          "nextSteps": "what to focus on next"
        }`;
        break;

      case 'system-design':
        evaluationPrompt = `
        You are an expert system design interviewer evaluating a design solution.
        
        QUESTION: ${JSON.stringify(currentQuestion)}
        USER RESPONSE: ${userResponse}
        
        Evaluate this system design and provide feedback in this JSON format:
        {
          "score": number between 0-100,
          "completeness": "complete|partial|incomplete",
          "feedback": {
            "strengths": ["strength 1", "strength 2"],
            "weaknesses": ["weakness 1", "weakness 2"],
            "missingComponents": ["missing 1", "missing 2"] or null
          },
          "scalabilityAssessment": "assessment of scalability approach",
          "architecturalChoices": "evaluation of architectural decisions",
          "followUpQuestions": ["follow-up 1", "follow-up 2"],
          "suggestions": ["suggestion 1", "suggestion 2"],
          "nextSteps": "what to discuss next"
        }`;
        break;

      case 'behavioral':
        evaluationPrompt = `
        You are an expert behavioral interviewer evaluating a STAR method response.
        
        QUESTION: ${JSON.stringify(currentQuestion)}
        USER RESPONSE: ${userResponse}
        
        Evaluate this behavioral response and provide feedback in this JSON format:
        {
          "score": number between 0-100,
          "starMethodUsage": {
            "situation": "clear|unclear|missing",
            "task": "clear|unclear|missing", 
            "action": "clear|unclear|missing",
            "result": "clear|unclear|missing"
          },
          "feedback": {
            "strengths": ["strength 1", "strength 2"],
            "improvements": ["improvement 1", "improvement 2"]
          },
          "leadershipQualities": ["quality 1", "quality 2"] or null,
          "followUpQuestions": ["follow-up 1", "follow-up 2"],
          "suggestions": ["suggestion 1", "suggestion 2"],
          "nextSteps": "what to explore next"
        }`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid interview mode' },
          { status: 400 }
        );
    }

    evaluationPrompt += '\n\nReturn only valid JSON without any markdown formatting or additional text.';

    const result = await model.generateContent(evaluationPrompt);
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

    const evaluation = JSON.parse(cleanedText);

    return NextResponse.json({
      success: true,
      evaluation,
      metadata: {
        mode,
        evaluatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error evaluating response:', error);
    console.log('Falling back to mock evaluation');
    return getFallbackEvaluation(mode, userResponse, currentQuestion, codeSubmission, language);
  }
}

// Fallback evaluation function when AI is not available
function getFallbackEvaluation(mode, userResponse, currentQuestion, codeSubmission, language) {
  if (mode === 'technical-coding') {
    const codeLength = codeSubmission ? codeSubmission.length : 0;
    const hasBasicStructure = codeSubmission && (
      codeSubmission.includes('function') ||
      codeSubmission.includes('def ') ||
      codeSubmission.includes('public ')
    );

    const score = Math.min(85, Math.max(45,
      (hasBasicStructure ? 60 : 30) +
      Math.min(25, Math.floor(codeLength / 10))
    ));

    return NextResponse.json({
      success: true,
      evaluation: {
        score: score,
        correctness: score >= 70 ? "correct" : score >= 50 ? "partially_correct" : "incorrect",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        feedback: {
          positive: hasBasicStructure ? [
            "Good code structure",
            "Proper function definition"
          ] : ["Code submitted"],
          improvements: score < 70 ? [
            "Consider edge cases",
            "Optimize the algorithm",
            "Add more detailed logic"
          ] : ["Minor optimizations possible"],
          bugs: score < 50 ? ["Logic needs refinement"] : null
        },
        testResults: [
          {
            input: "Test case 1",
            expected: "Expected output",
            actual: score >= 60 ? "Expected output" : "Different output",
            passed: score >= 60
          }
        ],
        suggestions: [
          "Practice more similar problems",
          "Focus on edge cases"
        ],
        nextSteps: "Continue practicing algorithm problems"
      },
      metadata: {
        mode,
        evaluatedAt: new Date().toISOString(),
        source: 'fallback'
      }
    });
  } else if (mode === 'behavioral') {
    const responseLength = userResponse ? userResponse.length : 0;
    const hasStructure = userResponse && (
      userResponse.toLowerCase().includes('situation') ||
      userResponse.toLowerCase().includes('when') ||
      userResponse.toLowerCase().includes('project')
    );

    const score = Math.min(90, Math.max(50,
      (hasStructure ? 70 : 40) +
      Math.min(20, Math.floor(responseLength / 50))
    ));

    return NextResponse.json({
      success: true,
      evaluation: {
        score: score,
        starMethodUsage: {
          situation: hasStructure ? "clear" : "unclear",
          task: responseLength > 100 ? "clear" : "unclear",
          action: responseLength > 150 ? "clear" : "unclear",
          result: responseLength > 200 ? "clear" : "missing"
        },
        feedback: {
          strengths: score >= 70 ? [
            "Good example provided",
            "Clear communication"
          ] : ["Response provided"],
          improvements: score < 80 ? [
            "Use more specific details",
            "Follow STAR method more closely",
            "Quantify your impact"
          ] : ["Minor details could be added"]
        },
        leadershipQualities: score >= 75 ? [
          "Problem-solving",
          "Communication"
        ] : null,
        followUpQuestions: [
          "Can you provide more specific details?",
          "What was the quantifiable impact?"
        ],
        suggestions: [
          "Practice STAR method",
          "Prepare specific examples"
        ],
        nextSteps: "Prepare more detailed examples with measurable outcomes"
      },
      metadata: {
        mode,
        evaluatedAt: new Date().toISOString(),
        source: 'fallback'
      }
    });
  } else if (mode === 'system-design') {
    const responseLength = userResponse ? userResponse.length : 0;
    const hasKeywords = userResponse && (
      userResponse.toLowerCase().includes('database') ||
      userResponse.toLowerCase().includes('api') ||
      userResponse.toLowerCase().includes('scale')
    );

    const score = Math.min(85, Math.max(40,
      (hasKeywords ? 65 : 35) +
      Math.min(20, Math.floor(responseLength / 100))
    ));

    return NextResponse.json({
      success: true,
      evaluation: {
        score: score,
        completeness: score >= 70 ? "complete" : score >= 50 ? "partial" : "incomplete",
        feedback: {
          strengths: hasKeywords ? [
            "Identified key components",
            "Considered scalability"
          ] : ["Design attempt provided"],
          weaknesses: score < 70 ? [
            "Missing key components",
            "Limited scalability discussion",
            "Need more detail on data flow"
          ] : ["Could elaborate on edge cases"],
          missingComponents: score < 60 ? [
            "Load balancer",
            "Caching strategy",
            "Database design"
          ] : null
        },
        scalabilityAssessment: "Basic scalability considerations present",
        architecturalChoices: "Standard architectural patterns mentioned",
        followUpQuestions: [
          "How would you handle database failures?",
          "What about caching strategy?"
        ],
        suggestions: [
          "Study system design patterns",
          "Practice with more examples"
        ],
        nextSteps: "Focus on scalability and reliability aspects"
      },
      metadata: {
        mode,
        evaluatedAt: new Date().toISOString(),
        source: 'fallback'
      }
    });
  }

  // Default fallback
  return NextResponse.json({
    success: true,
    evaluation: {
      score: 65,
      feedback: {
        positive: ["Response provided"],
        improvements: ["Could provide more detail"]
      },
      suggestions: ["Continue practicing"],
      nextSteps: "Keep working on interview skills"
    },
    metadata: {
      mode,
      evaluatedAt: new Date().toISOString(),
      source: 'fallback'
    }
  });
}
