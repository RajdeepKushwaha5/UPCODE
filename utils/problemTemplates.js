// Problem-specific code templates based on problem patterns and data structures

const PROBLEM_PATTERNS = {
  // Array problems
  'two-sum': {
    pattern: 'array-hashmap',
    description: 'Array with target sum using hash map',
    templates: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const numMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        
        numMap.set(nums[i], i);
    }
    
    return [];
};`,
      python: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
            
        num_map[num] = i
    
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            
            numMap.put(nums[i], i);
        }
        
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            
            numMap[nums[i]] = i;
        }
        
        return {};
    }
};`
    }
  },

  // Add more problem-specific templates
  'valid-parentheses': {
    pattern: 'stack',
    description: 'Stack-based validation problem',
    templates: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = [];
    const mapping = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char in mapping) {
            const topElement = stack.length === 0 ? '#' : stack.pop();
            if (mapping[char] !== topElement) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
};`,
      python: `def isValid(s):
    """
    :type s: str
    :rtype: bool
    """
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    
    return not stack`
    }
  },

  'binary-tree-inorder-traversal': {
    pattern: 'binary-tree',
    description: 'Binary tree traversal problem',
    templates: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const result = [];
    
    function inorder(node) {
        if (node !== null) {
            inorder(node.left);
            result.push(node.val);
            inorder(node.right);
        }
    }
    
    inorder(root);
    return result;
};`,
      python: `# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def inorderTraversal(root):
    """
    :type root: TreeNode
    :rtype: List[int]
    """
    result = []
    
    def inorder(node):
        if node:
            inorder(node.left)
            result.append(node.val)
            inorder(node.right)
    
    inorder(root)
    return result`
    }
  }
}

// Default templates for different problem types
const DEFAULT_TEMPLATES = {
  array: {
    javascript: `/**
 * @param {type[]} input
 * @return {type}
 */
var solution = function(input) {
    // Your solution here
    
};`,
    python: `def solution(input):
    """
    :type input: List[type]
    :rtype: type
    """
    # Your solution here
    pass`,
    java: `class Solution {
    public returnType solution(inputType[] input) {
        // Your solution here
        
    }
}`,
    cpp: `class Solution {
public:
    returnType solution(vector<inputType>& input) {
        // Your solution here
        
    }
};`
  },
  
  string: {
    javascript: `/**
 * @param {string} s
 * @return {type}
 */
var solution = function(s) {
    // Your solution here
    
};`,
    python: `def solution(s):
    """
    :type s: str
    :rtype: type  
    """
    # Your solution here
    pass`
  },

  tree: {
    javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {type}
 */
var solution = function(root) {
    // Your solution here
    
};`,
    python: `# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def solution(root):
    """
    :type root: TreeNode
    :rtype: type
    """
    # Your solution here
    pass`
  }
}

export function getProblemSpecificTemplate(problemSlug, language) {
  // Check if we have a specific template for this problem
  if (PROBLEM_PATTERNS[problemSlug]) {
    const problemTemplate = PROBLEM_PATTERNS[problemSlug].templates[language]
    if (problemTemplate) {
      return problemTemplate
    }
  }

  // Fallback to default template based on problem tags/pattern
  return getDefaultTemplate(language)
}

export function getDefaultTemplate(language) {
  return DEFAULT_TEMPLATES.array[language] || `// Write your ${language} solution here`
}

export function detectProblemPattern(problem) {
  if (!problem) return 'array'

  const title = problem.title?.toLowerCase() || ''
  const description = problem.description?.toLowerCase() || ''
  const tags = problem.tags?.map(tag => tag.toLowerCase()) || []

  // Pattern detection based on title, description, and tags
  if (title.includes('tree') || tags.includes('tree') || tags.includes('binary tree')) {
    return 'tree'
  }
  
  if (title.includes('string') || tags.includes('string')) {
    return 'string'
  }
  
  if (title.includes('linked list') || tags.includes('linked list')) {
    return 'linkedlist'
  }
  
  if (tags.includes('stack') || tags.includes('queue')) {
    return 'stack'
  }
  
  if (tags.includes('graph') || tags.includes('dfs') || tags.includes('bfs')) {
    return 'graph'
  }

  // Default to array
  return 'array'
}

export function getAllProblemPatterns() {
  return Object.keys(PROBLEM_PATTERNS)
}
