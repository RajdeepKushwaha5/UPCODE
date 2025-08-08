// Problem-related constants and configurations

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const DIFFICULTY_COLORS = {
  easy: {
    text: 'text-green-400',
    bg: 'bg-green-900/30',
    border: 'border-green-600/50',
    lightBg: 'bg-green-50',
    lightBorder: 'border-green-300'
  },
  medium: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-600/50',
    lightBg: 'bg-yellow-50',
    lightBorder: 'border-yellow-300'
  },
  hard: {
    text: 'text-red-400',
    bg: 'bg-red-900/30',
    border: 'border-red-600/50',
    lightBg: 'bg-red-50',
    lightBorder: 'border-red-300'
  }
};

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', ext: 'js' },
  { id: 'python', name: 'Python', ext: 'py' },
  { id: 'java', name: 'Java', ext: 'java' },
  { id: 'cpp', name: 'C++', ext: 'cpp' },
  { id: 'csharp', name: 'C#', ext: 'cs' },
  { id: 'go', name: 'Go', ext: 'go' },
  { id: 'rust', name: 'Rust', ext: 'rs' },
  { id: 'c', name: 'C', ext: 'c' }
];

export const CODE_TEMPLATES = {
  javascript: (functionName) => `function ${functionName}() {
    // Write your solution here
    return null;
}`,
  python: (functionName) => `def ${functionName}():
    # Write your solution here
    pass`,
  java: (functionName) => `class Solution {
    public int[] ${functionName}() {
        // Write your solution here
        return new int[0];
    }
}`,
  cpp: (functionName) => `class Solution {
public:
    vector<int> ${functionName}() {
        // Write your solution here
        return {};
    }
};`,
  csharp: (functionName) => `public class Solution {
    public int[] ${functionName}() {
        // Write your solution here
        return new int[0];
    }
}`,
  go: (functionName) => `func ${functionName}() []int {
    // Write your solution here
    return []int{}
}`,
  rust: (functionName) => `impl Solution {
    pub fn ${functionName}() -> Vec<i32> {
        // Write your solution here
        vec![]
    }
}`,
  c: (functionName) => `#include <stdio.h>

int* ${functionName}() {
    // Write your solution here
    return NULL;
}`
};

export const PROBLEM_CATEGORIES = [
  'Array',
  'String',
  'Hash Table',
  'Dynamic Programming',
  'Math',
  'Sorting',
  'Greedy',
  'Depth-First Search',
  'Breadth-First Search',
  'Tree',
  'Binary Search',
  'Two Pointers',
  'Sliding Window',
  'Linked List',
  'Stack',
  'Queue',
  'Graph',
  'Heap',
  'Trie',
  'Backtracking'
];

export const COMPANIES = [
  'Google',
  'Amazon',
  'Facebook',
  'Microsoft',
  'Apple',
  'Netflix',
  'Uber',
  'Airbnb',
  'LinkedIn',
  'Twitter',
  'Spotify',
  'Tesla',
  'Oracle',
  'IBM',
  'Adobe',
  'Salesforce',
  'PayPal',
  'eBay',
  'Dropbox',
  'Slack'
];
