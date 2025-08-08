import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { question, answer, difficulty, roleType } = await request.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    // Simulate AI evaluation (replace with actual AI service like OpenAI GPT-4)
    const evaluation = await evaluateWithAI({
      question: question.question || question,
      answer,
      difficulty: difficulty || 'medium',
      roleType: roleType || 'fullstack'
    });

    return NextResponse.json(evaluation);

  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}

// AI evaluation function (simulated - replace with actual AI service)
async function evaluateWithAI({ question, answer, difficulty, roleType }) {
  // This is a simplified evaluation. In production, you would use OpenAI GPT-4 or similar
  
  const answerLength = answer.trim().length;
  const hasExamples = answer.toLowerCase().includes('example') || answer.toLowerCase().includes('for instance');
  const hasTechnicalTerms = /\b(algorithm|function|variable|database|api|framework|library|component|method|class|object|array|string|number|boolean|promise|async|await|callback|closure|scope|hoisting|prototype|inheritance|polymorphism|encapsulation|abstraction|solid|mvc|mvvm|rest|graphql|microservice|monolith|sql|nosql|crud|http|https|json|xml|html|css|javascript|typescript|react|angular|vue|node|express|mongodb|postgresql|mysql|redis|docker|kubernetes|aws|azure|gcp|git|github|gitlab|ci|cd|devops|testing|unit|integration|e2e|jest|mocha|cypress|webpack|babel|eslint|prettier|agile|scrum|kanban)\b/gi.test(answer);
  
  // Base score calculation
  let score = 50; // Start with base score
  
  // Length-based scoring
  if (answerLength > 200) score += 15;
  else if (answerLength > 100) score += 10;
  else if (answerLength > 50) score += 5;
  
  // Content quality
  if (hasExamples) score += 10;
  if (hasTechnicalTerms) score += 15;
  
  // Difficulty adjustment
  const difficultyMultiplier = {
    easy: 1.0,
    medium: 0.9,
    hard: 0.8
  };
  
  score = Math.round(score * (difficultyMultiplier[difficulty] || 0.9));
  
  // Ensure score is within bounds
  score = Math.min(100, Math.max(40, score));
  
  // Generate feedback based on score
  let feedback = '';
  let strengths = [];
  let improvements = [];
  
  if (score >= 90) {
    feedback = 'Excellent answer! You demonstrated deep understanding and provided comprehensive details.';
    strengths = ['Comprehensive knowledge', 'Clear explanation', 'Good examples', 'Professional terminology'];
    improvements = ['Continue maintaining this level of excellence'];
  } else if (score >= 80) {
    feedback = 'Very good answer! You showed solid understanding with room for minor improvements.';
    strengths = ['Good technical knowledge', 'Clear communication', 'Relevant points'];
    improvements = ['Consider adding more specific examples', 'Expand on technical details'];
  } else if (score >= 70) {
    feedback = 'Good answer! You covered the basics well but could enhance with more details.';
    strengths = ['Basic understanding', 'Logical structure'];
    improvements = ['Add more technical depth', 'Include practical examples', 'Improve clarity'];
  } else if (score >= 60) {
    feedback = 'Adequate answer but needs improvement in technical depth and clarity.';
    strengths = ['Shows effort', 'Basic concepts mentioned'];
    improvements = ['Study core concepts more thoroughly', 'Practice explaining technical topics', 'Use more precise terminology'];
  } else {
    feedback = 'The answer needs significant improvement. Focus on understanding fundamental concepts.';
    strengths = ['Shows willingness to attempt'];
    improvements = ['Review fundamental concepts', 'Practice technical communication', 'Study relevant documentation'];
  }
  
  return {
    score,
    feedback,
    strengths,
    improvements,
    technicalAccuracy: score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low',
    communicationClarity: answerLength > 100 ? 'Good' : 'Needs improvement',
    confidence: score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : 'Needs work',
    timestamp: new Date().toISOString()
  };
}

// Alternative: Using OpenAI GPT-4 for evaluation (uncomment and configure when ready)
/*
async function evaluateWithOpenAI({ question, answer, difficulty, roleType }) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
    Evaluate this interview answer on a scale of 0-100:
    
    Role: ${roleType}
    Difficulty: ${difficulty}
    Question: ${question}
    Answer: ${answer}
    
    Provide evaluation in JSON format:
    {
      "score": number (0-100),
      "feedback": "detailed feedback string",
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "technicalAccuracy": "High/Medium/Low",
      "communicationClarity": "Excellent/Good/Needs improvement",
      "confidence": "Strong/Moderate/Needs work"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Evaluate answers fairly and provide constructive feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const evaluation = JSON.parse(response.choices[0].message.content);
    evaluation.timestamp = new Date().toISOString();
    
    return evaluation;
  } catch (error) {
    console.error('OpenAI evaluation error:', error);
    // Fallback to simple evaluation
    return evaluateWithAI({ question, answer, difficulty, roleType });
  }
}
*/
