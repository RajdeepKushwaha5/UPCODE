// Gemini AI Service for Problem Generation
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateProblem = async (difficulty = 'medium', topic = 'algorithms') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a coding problem with the following specifications:
    - Difficulty: ${difficulty}
    - Topic: ${topic}
    - Format the response as JSON with the following structure:
    {
      "title": "Problem title",
      "difficulty": "${difficulty}",
      "acceptance_rate": "percentage",
      "description": "Problem description with examples",
      "examples": [
        {
          "input": "example input",
          "output": "example output",
          "explanation": "explanation"
        }
      ],
      "constraints": ["constraint 1", "constraint 2"],
      "tags": ["tag1", "tag2"],
      "hints": ["hint 1", "hint 2"]
    }
    
    Make it a realistic competitive programming problem that would fit on platforms like LeetCode or Codeforces.`;

    const result = await genAI.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating problem:', error);
    return null;
  }
};

export const explainSolution = async (problemTitle, userCode, language) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this ${language} code solution for the problem "${problemTitle}":

${userCode}

Provide a detailed explanation including:
1. Algorithm approach
2. Time complexity
3. Space complexity
4. Code walkthrough
5. Potential optimizations
6. Common mistakes to avoid

Format your response in markdown.`;

    const result = await genAI.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error explaining solution:', error);
    return 'Unable to generate explanation at this time.';
  }
};

export const generateHints = async (problemTitle, difficulty) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate 3 progressive hints for the coding problem "${problemTitle}" (difficulty: ${difficulty}):

1. First hint should be a gentle nudge about the approach
2. Second hint should be more specific about the algorithm/data structure
3. Third hint should be almost a step-by-step approach

Format as JSON array: ["hint1", "hint2", "hint3"]`;

    const result = await genAI.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return ['Think about the data structure needed', 'Consider the time complexity', 'Break down into smaller subproblems'];
  } catch (error) {
    console.error('Error generating hints:', error);
    return ['Think about the data structure needed', 'Consider the time complexity', 'Break down into smaller subproblems'];
  }
};
