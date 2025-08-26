import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { topics, difficulty = 'medium', questionCount = 5, interviewType = 'technical-coding' } = await request.json();

    if (!topics || topics.length === 0) {
      return NextResponse.json(
        { error: 'Topics are required' },
        { status: 400 }
      );
    }

    // Generate AI-powered interview questions based on topics
    const questions = await generateInterviewQuestions(topics, difficulty, questionCount, interviewType);

    return NextResponse.json({
      success: true,
      questions,
      metadata: {
        topics,
        difficulty,
        questionCount,
        interviewType,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating interview questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview questions' },
      { status: 500 }
    );
  }
}

async function generateInterviewQuestions(topics, difficulty, questionCount, interviewType) {
  const questions = [];
  
  // Define question templates based on interview type and topics
  const questionTemplates = {
    'technical-coding': {
      'javascript': [
        'Implement a function to find the longest substring without repeating characters',
        'Create a debounce function that delays execution until after a specified time',
        'Write a function to deep clone a nested object without using JSON methods',
        'Implement a custom Promise.all() function from scratch',
        'Create a function to detect if a string is a valid palindrome'
      ],
      'python': [
        'Implement a function to find the missing number in an array of 1 to n',
        'Write a decorator that measures execution time of functions',
        'Create a generator function that produces Fibonacci sequence',
        'Implement a LRU (Least Recently Used) cache using Python',
        'Write a function to merge two sorted linked lists'
      ],
      'react': [
        'Create a custom hook for managing form state with validation',
        'Implement a React component that handles infinite scrolling',
        'Build a higher-order component for authentication',
        'Create a context provider for theme switching',
        'Implement a React component with optimistic updates'
      ],
      'data-structures': [
        'Implement a binary search tree with insertion and deletion',
        'Create a graph class with DFS and BFS traversal methods',
        'Build a min-heap data structure with extract-min operation',
        'Implement a trie (prefix tree) for word suggestions',
        'Create a hash table with collision handling using chaining'
      ],
      'algorithms': [
        'Implement quicksort algorithm with random pivot selection',
        'Write a function to find the shortest path in a weighted graph',
        'Create an algorithm to detect cycles in a directed graph',
        'Implement dynamic programming solution for coin change problem',
        'Write a function to find all anagrams in a list of strings'
      ]
    },
    'system-design': {
      'scalability': [
        'Design a URL shortening service like bit.ly that can handle 100M URLs per day',
        'Architect a real-time chat application supporting millions of concurrent users',
        'Design a distributed cache system with consistent hashing',
        'Create a system design for a social media news feed',
        'Design a video streaming platform like YouTube with global CDN'
      ],
      'databases': [
        'Design the database schema for an e-commerce platform',
        'Explain how you would handle data consistency in a microservices architecture',
        'Design a sharding strategy for a user database with 100M+ users',
        'Create a database design for a ride-sharing application',
        'Design a time-series database for IoT sensor data'
      ],
      'microservices': [
        'Design a microservices architecture for an online banking system',
        'Explain service discovery and load balancing in microservices',
        'Design API gateway patterns for microservices communication',
        'Create a distributed logging and monitoring system',
        'Design event-driven architecture using message queues'
      ]
    },
    'behavioral': {
      'leadership': [
        'Tell me about a time when you had to lead a team through a difficult project',
        'Describe a situation where you had to make a decision without all the information',
        'How do you handle conflicts within your team?',
        'Give an example of when you had to motivate team members',
        'Describe a time when you had to adapt your leadership style'
      ],
      'problem-solving': [
        'Walk me through a complex technical problem you solved recently',
        'Describe a time when you had to debug a critical production issue',
        'How do you approach learning new technologies?',
        'Tell me about a project that didn\'t go as planned and how you handled it',
        'Describe your process for breaking down complex requirements'
      ],
      'communication': [
        'How do you explain technical concepts to non-technical stakeholders?',
        'Describe a time when you had to give difficult feedback to a colleague',
        'How do you handle disagreements with team members?',
        'Tell me about a presentation you gave that was well-received',
        'Describe how you collaborate with cross-functional teams'
      ]
    }
  };

  // Difficulty multipliers for complexity
  const difficultySettings = {
    'easy': { complexity: 0.5, timeLimit: 15 },
    'medium': { complexity: 1.0, timeLimit: 25 },
    'hard': { complexity: 1.5, timeLimit: 35 }
  };

  const settings = difficultySettings[difficulty];

  // Generate questions based on selected topics
  for (let i = 0; i < questionCount; i++) {
    const topic = topics[i % topics.length];
    const templateKey = topic.toLowerCase().replace(/\s+/g, '-');
    
    let questionPool = [];
    if (questionTemplates[interviewType] && questionTemplates[interviewType][templateKey]) {
      questionPool = questionTemplates[interviewType][templateKey];
    } else {
      // Fallback to general questions if specific topic not found
      const fallbackTopics = Object.keys(questionTemplates[interviewType]);
      if (fallbackTopics.length > 0) {
        questionPool = questionTemplates[interviewType][fallbackTopics[0]];
      }
    }

    if (questionPool.length > 0) {
      const randomQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];
      
      const question = {
        id: `q_${Date.now()}_${i}`,
        title: `${topic} Challenge ${i + 1}`,
        description: randomQuestion,
        topic: topic,
        difficulty: difficulty,
        timeLimit: settings.timeLimit * 60, // Convert to seconds
        points: Math.floor(100 * settings.complexity),
        hints: generateHints(randomQuestion, topic),
        testCases: generateTestCases(randomQuestion, interviewType),
        starterCode: generateStarterCode(randomQuestion, topic, interviewType)
      };

      questions.push(question);
    }
  }

  return questions;
}

function generateHints(question, topic) {
  const hints = [
    `Consider the time and space complexity requirements for this ${topic} problem`,
    "Think about edge cases like empty inputs or boundary conditions",
    "Break down the problem into smaller, manageable sub-problems"
  ];

  // Topic-specific hints
  if (topic.toLowerCase().includes('javascript')) {
    hints.push("Consider using built-in JavaScript methods like map, filter, or reduce");
  } else if (topic.toLowerCase().includes('python')) {
    hints.push("Think about Python's built-in functions and data structures");
  } else if (topic.toLowerCase().includes('react')) {
    hints.push("Consider React hooks and component lifecycle methods");
  }

  return hints.slice(0, 3); // Return max 3 hints
}

function generateTestCases(question, interviewType) {
  if (interviewType === 'technical-coding') {
    return [
      {
        input: "Example input 1",
        expectedOutput: "Expected output 1",
        explanation: "Basic test case"
      },
      {
        input: "Example input 2", 
        expectedOutput: "Expected output 2",
        explanation: "Edge case test"
      },
      {
        input: "Example input 3",
        expectedOutput: "Expected output 3", 
        explanation: "Complex scenario"
      }
    ];
  }
  return [];
}

function generateStarterCode(question, topic, interviewType) {
  if (interviewType !== 'technical-coding') return null;

  const templates = {
    'javascript': `// ${question}
function solution() {
    // Your implementation here
    
    return result;
}

// Test your solution
console.log(solution());`,
    
    'python': `# ${question}
def solution():
    """
    Your implementation here
    """
    
    return result

# Test your solution
if __name__ == "__main__":
    print(solution())`,

    'react': `// ${question}
import React, { useState, useEffect } from 'react';

const Solution = () => {
    // Your implementation here
    return <div>Solution</div>;
};

export default Solution;`
  };

  return templates[language] || templates.javascript;
}
