// Enhanced problems data with unique problems, premium features, and comprehensive metadata
export const getNewProblems = () => {
  return [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Array",
      tags: ["Hash Table", "Array"],
      companies: ["Google", "Amazon", "Facebook"],
      isPremium: false,
      acceptanceRate: 47.2,
      totalSubmissions: 5234567,
      solvedCount: 2470794,
      youtubeUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]",
      testCases: {
        visible: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] }
        ],
        hidden: [
          { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
        ]
      },
      starterCode: {
        javascript: "function twoSum(nums, target) {\n    // Your code here\n}",
        python: "def two_sum(nums, target):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Hash Map",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        explanation: "Use a hash map to store numbers and their indices.",
        code: { javascript: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n}" }
      },
      hints: ["Try using a hash table", "Calculate the complement for each number"],
      aiContext: "Classic array problem using hash table technique."
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      category: "Stack",
      tags: ["String", "Stack"],
      companies: ["Microsoft", "Google", "Amazon"],
      isPremium: false,
      acceptanceRate: 40.1,
      totalSubmissions: 3456789,
      solvedCount: 1386148,
      youtubeUrl: "https://www.youtube.com/watch?v=WTzjTskDFMg",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nExample 1:\nInput: s = \"()\"\nOutput: true\n\nExample 2:\nInput: s = \"()[]{}\"\nOutput: true\n\nExample 3:\nInput: s = \"(]\"\nOutput: false",
      testCases: {
        visible: [
          { input: { s: "()" }, output: true },
          { input: { s: "()[]{}" }, output: true }
        ],
        hidden: [
          { input: { s: "(]" }, output: false }
        ]
      },
      starterCode: {
        javascript: "function isValid(s) {\n    // Your code here\n}",
        python: "def is_valid(s):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Stack",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        explanation: "Use a stack to keep track of opening brackets.",
        code: { javascript: "function isValid(s) {\n    const stack = [];\n    const mapping = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (char in mapping) {\n            if (stack.length === 0 || stack.pop() !== mapping[char]) {\n                return false;\n            }\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}" }
      },
      hints: ["Use a stack data structure", "Match opening and closing brackets"],
      aiContext: "Stack problem for bracket matching and validation."
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      category: "String",
      tags: ["Hash Table", "String", "Sliding Window"],
      companies: ["Amazon", "Microsoft", "Google"],
      isPremium: true,
      acceptanceRate: 33.8,
      totalSubmissions: 4123456,
      solvedCount: 1393778,
      youtubeUrl: "https://www.youtube.com/watch?v=wiGpQwVHdE0",
      description: "Given a string s, find the length of the longest substring without repeating characters.\n\nExample 1:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.\n\nExample 2:\nInput: s = \"bbbbb\"\nOutput: 1\nExplanation: The answer is \"b\", with the length of 1.\n\nExample 3:\nInput: s = \"pwwkew\"\nOutput: 3\nExplanation: The answer is \"wke\", with the length of 3.",
      testCases: {
        visible: [
          { input: { s: "abcabcbb" }, output: 3 },
          { input: { s: "bbbbb" }, output: 1 }
        ],
        hidden: [
          { input: { s: "pwwkew" }, output: 3 }
        ]
      },
      starterCode: {
        javascript: "function lengthOfLongestSubstring(s) {\n    // Your code here\n}",
        python: "def lengthOfLongestSubstring(s):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Sliding Window",
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(m,n))",
        explanation: "Use sliding window technique with a hash set.",
        code: { javascript: "function lengthOfLongestSubstring(s) {\n    let left = 0, maxLen = 0;\n    const seen = new Set();\n    for (let right = 0; right < s.length; right++) {\n        while (seen.has(s[right])) {\n            seen.delete(s[left]);\n            left++;\n        }\n        seen.add(s[right]);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}" }
      },
      hints: ["Consider using a sliding window", "Track characters in current window"],
      aiContext: "Sliding window technique for substring problems."
    },
    {
      id: 4,
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      category: "Linked List",
      tags: ["Linked List", "Recursion"],
      companies: ["Google", "Amazon", "Microsoft"],
      isPremium: false,
      acceptanceRate: 59.8,
      totalSubmissions: 2876543,
      solvedCount: 1720732,
      youtubeUrl: "https://www.youtube.com/watch?v=XIdigk956u0",
      description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.\n\nExample 1:\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]\n\nExample 2:\nInput: list1 = [], list2 = []\nOutput: []\n\nExample 3:\nInput: list1 = [], list2 = [0]\nOutput: [0]",
      testCases: {
        visible: [
          { input: { list1: [1,2,4], list2: [1,3,4] }, output: [1,1,2,3,4,4] },
          { input: { list1: [], list2: [] }, output: [] }
        ],
        hidden: [
          { input: { list1: [], list2: [0] }, output: [0] }
        ]
      },
      starterCode: {
        javascript: "function mergeTwoLists(list1, list2) {\n    // Your code here\n}",
        python: "def merge_two_lists(list1, list2):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Two Pointers",
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(1)",
        explanation: "Use dummy node and two pointers to merge lists.",
        code: { javascript: "function mergeTwoLists(list1, list2) {\n    let dummy = new ListNode(0);\n    let current = dummy;\n    while (list1 && list2) {\n        if (list1.val <= list2.val) {\n            current.next = list1;\n            list1 = list1.next;\n        } else {\n            current.next = list2;\n            list2 = list2.next;\n        }\n        current = current.next;\n    }\n    current.next = list1 || list2;\n    return dummy.next;\n}" }
      },
      hints: ["Use a dummy node", "Compare values and link nodes"],
      aiContext: "Linked list merging using two pointers technique."
    },
    {
      id: 5,
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      category: "Tree",
      tags: ["Tree", "DFS", "BFS", "Binary Tree"],
      companies: ["Facebook", "Amazon", "Google"],
      isPremium: false,
      acceptanceRate: 71.2,
      totalSubmissions: 1987654,
      solvedCount: 1415130,
      youtubeUrl: "https://www.youtube.com/watch?v=hTM3phVI6YQ",
      description: "Given the root of a binary tree, return its maximum depth.\n\nExample 1:\nInput: root = [3,9,20,null,null,15,7]\nOutput: 3\n\nExample 2:\nInput: root = [1,null,2]\nOutput: 2",
      testCases: {
        visible: [
          { input: { root: [3,9,20,null,null,15,7] }, output: 3 },
          { input: { root: [1,null,2] }, output: 2 }
        ],
        hidden: [
          { input: { root: [] }, output: 0 }
        ]
      },
      starterCode: {
        javascript: "function maxDepth(root) {\n    // Your code here\n}",
        python: "def max_depth(root):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "DFS Recursion",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        explanation: "Recursively calculate depth of left and right subtrees.",
        code: { javascript: "function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}" }
      },
      hints: ["Use recursion", "Base case: null node has depth 0"],
      aiContext: "Tree traversal using depth-first search."
    },
    {
      id: 6,
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      category: "Dynamic Programming",
      tags: ["Array", "Dynamic Programming"],
      companies: ["Amazon", "Microsoft", "Facebook"],
      isPremium: false,
      acceptanceRate: 52.4,
      totalSubmissions: 3456789,
      solvedCount: 1811467,
      youtubeUrl: "https://www.youtube.com/watch?v=1pkOgXD63yU",
      description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0.",
      testCases: {
        visible: [
          { input: { prices: [7,1,5,3,6,4] }, output: 5 },
          { input: { prices: [7,6,4,3,1] }, output: 0 }
        ],
        hidden: [
          { input: { prices: [1,2,3,4,5] }, output: 4 }
        ]
      },
      starterCode: {
        javascript: "function maxProfit(prices) {\n    // Your code here\n}",
        python: "def max_profit(prices):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "One Pass",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Track minimum price and maximum profit in one pass.",
        code: { javascript: "function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let price of prices) {\n        minPrice = Math.min(minPrice, price);\n        maxProfit = Math.max(maxProfit, price - minPrice);\n    }\n    return maxProfit;\n}" }
      },
      hints: ["Track the minimum price seen so far", "Calculate profit at each step"],
      aiContext: "Dynamic programming problem with optimal substructure."
    },
    {
      id: 7,
      title: "Contains Duplicate",
      difficulty: "Easy",
      category: "Array",
      tags: ["Array", "Hash Table", "Sorting"],
      companies: ["Google", "Apple", "Amazon"],
      isPremium: false,
      acceptanceRate: 58.7,
      totalSubmissions: 2123456,
      solvedCount: 1246503,
      youtubeUrl: "https://www.youtube.com/watch?v=3OamzN90kPg",
      description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\n\nExample 1:\nInput: nums = [1,2,3,1]\nOutput: true\n\nExample 2:\nInput: nums = [1,2,3,4]\nOutput: false\n\nExample 3:\nInput: nums = [1,1,1,3,3,4,3,2,4,2]\nOutput: true",
      testCases: {
        visible: [
          { input: { nums: [1,2,3,1] }, output: true },
          { input: { nums: [1,2,3,4] }, output: false }
        ],
        hidden: [
          { input: { nums: [1,1,1,3,3,4,3,2,4,2] }, output: true }
        ]
      },
      starterCode: {
        javascript: "function containsDuplicate(nums) {\n    // Your code here\n}",
        python: "def contains_duplicate(nums):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Hash Set",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        explanation: "Use a set to track seen elements.",
        code: { javascript: "function containsDuplicate(nums) {\n    const seen = new Set();\n    for (let num of nums) {\n        if (seen.has(num)) return true;\n        seen.add(num);\n    }\n    return false;\n}" }
      },
      hints: ["Use a hash set to track seen numbers", "Return true as soon as duplicate is found"],
      aiContext: "Array problem using hash table for duplicate detection."
    },
    {
      id: 8,
      title: "Add Two Numbers",
      difficulty: "Medium",
      category: "Linked List",
      tags: ["Linked List", "Math", "Recursion"],
      companies: ["Amazon", "Microsoft", "Adobe"],
      isPremium: false,
      acceptanceRate: 36.9,
      totalSubmissions: 4567890,
      solvedCount: 1685673,
      youtubeUrl: "https://www.youtube.com/watch?v=wgFPrzTjm7s",
      description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nExample 1:\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.\n\nExample 2:\nInput: l1 = [0], l2 = [0]\nOutput: [0]\n\nExample 3:\nInput: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\nOutput: [8,9,9,9,0,0,0,1]\nExplanation: 9999999 + 9999 = 10009998.",
      testCases: {
        visible: [
          { input: { l1: [2,4,3], l2: [5,6,4] }, output: [7,0,8] },
          { input: { l1: [0], l2: [0] }, output: [0] }
        ],
        hidden: [
          { input: { l1: [9,9,9,9,9,9,9], l2: [9,9,9,9] }, output: [8,9,9,9,0,0,0,1] }
        ]
      },
      starterCode: {
        javascript: "function addTwoNumbers(l1, l2) {\n    // Your code here\n}",
        python: "def add_two_numbers(l1, l2):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Elementary Math",
        timeComplexity: "O(max(m, n))",
        spaceComplexity: "O(max(m, n))",
        explanation: "Simulate digit-by-digit addition with carry.",
        code: { javascript: "function addTwoNumbers(l1, l2) {\n    let dummy = new ListNode(0);\n    let current = dummy;\n    let carry = 0;\n    while (l1 || l2 || carry) {\n        let sum = carry;\n        if (l1) { sum += l1.val; l1 = l1.next; }\n        if (l2) { sum += l2.val; l2 = l2.next; }\n        carry = Math.floor(sum / 10);\n        current.next = new ListNode(sum % 10);\n        current = current.next;\n    }\n    return dummy.next;\n}" }
      },
      hints: ["Handle carry properly", "Use dummy node for simplicity"],
      aiContext: "Linked list arithmetic with carry handling."
    },
    {
      id: 9,
      title: "3Sum",
      difficulty: "Medium",
      category: "Array",
      tags: ["Array", "Two Pointers", "Sorting"],
      companies: ["Facebook", "Amazon", "Microsoft"],
      isPremium: true,
      acceptanceRate: 27.8,
      totalSubmissions: 3876543,
      solvedCount: 1077803,
      youtubeUrl: "https://www.youtube.com/watch?v=jzZsG8n2R9A",
      description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nExample 1:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\n\nExample 2:\nInput: nums = [0,1,1]\nOutput: []\nExplanation: The only possible triplet does not sum up to 0.\n\nExample 3:\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\nExplanation: The only possible triplet sums up to 0.",
      testCases: {
        visible: [
          { input: { nums: [-1,0,1,2,-1,-4] }, output: [[-1,-1,2],[-1,0,1]] },
          { input: { nums: [0,1,1] }, output: [] }
        ],
        hidden: [
          { input: { nums: [0,0,0] }, output: [[0,0,0]] }
        ]
      },
      starterCode: {
        javascript: "function threeSum(nums) {\n    // Your code here\n}",
        python: "def three_sum(nums):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Two Pointers",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Sort array and use two pointers for each element.",
        code: { javascript: "function threeSum(nums) {\n    nums.sort((a, b) => a - b);\n    const result = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i-1]) continue;\n        let left = i + 1, right = nums.length - 1;\n        while (left < right) {\n            const sum = nums[i] + nums[left] + nums[right];\n            if (sum === 0) {\n                result.push([nums[i], nums[left], nums[right]]);\n                while (left < right && nums[left] === nums[left+1]) left++;\n                while (left < right && nums[right] === nums[right-1]) right--;\n                left++; right--;\n            } else if (sum < 0) left++;\n            else right--;\n        }\n    }\n    return result;\n}" }
      },
      hints: ["Sort the array first", "Use two pointers to avoid duplicates"],
      aiContext: "Array problem using sorting and two-pointer technique."
    },
    {
      id: 10,
      title: "Container With Most Water",
      difficulty: "Medium",
      category: "Array",
      tags: ["Array", "Two Pointers", "Greedy"],
      companies: ["Facebook", "Amazon", "Google"],
      isPremium: false,
      acceptanceRate: 53.1,
      totalSubmissions: 2345678,
      solvedCount: 1245645,
      youtubeUrl: "https://www.youtube.com/watch?v=UuiTKBwPgAo",
      description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that can hold the most water.\n\nExample 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.\n\nExample 2:\nInput: height = [1,1]\nOutput: 1",
      testCases: {
        visible: [
          { input: { height: [1,8,6,2,5,4,8,3,7] }, output: 49 },
          { input: { height: [1,1] }, output: 1 }
        ],
        hidden: [
          { input: { height: [4,3,2,1,4] }, output: 16 }
        ]
      },
      starterCode: {
        javascript: "function maxArea(height) {\n    // Your code here\n}",
        python: "def max_area(height):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Two Pointers",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Use two pointers from both ends, move the shorter line.",
        code: { javascript: "function maxArea(height) {\n    let left = 0, right = height.length - 1;\n    let maxWater = 0;\n    while (left < right) {\n        const water = Math.min(height[left], height[right]) * (right - left);\n        maxWater = Math.max(maxWater, water);\n        if (height[left] < height[right]) left++;\n        else right--;\n    }\n    return maxWater;\n}" }
      },
      hints: ["Use two pointers from both ends", "Move the pointer with smaller height"],
      aiContext: "Greedy algorithm using two-pointer technique."
    },
    {
      id: 11,
      title: "Binary Tree Inorder Traversal",
      difficulty: "Easy",
      category: "Tree",
      tags: ["Stack", "Tree", "DFS", "Binary Tree"],
      companies: ["Microsoft", "Amazon", "Google"],
      isPremium: false,
      acceptanceRate: 67.4,
      totalSubmissions: 1876543,
      solvedCount: 1264530,
      youtubeUrl: "https://www.youtube.com/watch?v=WLvU5EQVZqY",
      description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.\n\nExample 1:\nInput: root = [1,null,2,3]\nOutput: [1,3,2]\n\nExample 2:\nInput: root = []\nOutput: []\n\nExample 3:\nInput: root = [1]\nOutput: [1]",
      testCases: {
        visible: [
          { input: { root: [1,null,2,3] }, output: [1,3,2] },
          { input: { root: [] }, output: [] }
        ],
        hidden: [
          { input: { root: [1] }, output: [1] }
        ]
      },
      starterCode: {
        javascript: "function inorderTraversal(root) {\n    // Your code here\n}",
        python: "def inorder_traversal(root):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Recursive DFS",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        explanation: "Recursively traverse left, visit node, traverse right.",
        code: { javascript: "function inorderTraversal(root) {\n    const result = [];\n    function inorder(node) {\n        if (!node) return;\n        inorder(node.left);\n        result.push(node.val);\n        inorder(node.right);\n    }\n    inorder(root);\n    return result;\n}" }
      },
      hints: ["Left -> Root -> Right", "Use recursion or stack"],
      aiContext: "Tree traversal using depth-first search pattern."
    },
    {
      id: 12,
      title: "Climbing Stairs",
      difficulty: "Easy",
      category: "Dynamic Programming",
      tags: ["Math", "Dynamic Programming", "Memoization"],
      companies: ["Amazon", "Google", "Adobe"],
      isPremium: false,
      acceptanceRate: 49.2,
      totalSubmissions: 2567890,
      solvedCount: 1263843,
      youtubeUrl: "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
      description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample 1:\nInput: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps\n\nExample 2:\nInput: n = 3\nOutput: 3\nExplanation: There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
      testCases: {
        visible: [
          { input: { n: 2 }, output: 2 },
          { input: { n: 3 }, output: 3 }
        ],
        hidden: [
          { input: { n: 5 }, output: 8 }
        ]
      },
      starterCode: {
        javascript: "function climbStairs(n) {\n    // Your code here\n}",
        python: "def climb_stairs(n):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Dynamic Programming",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Each step is sum of previous two steps (Fibonacci sequence).",
        code: { javascript: "function climbStairs(n) {\n    if (n <= 2) return n;\n    let prev1 = 1, prev2 = 2;\n    for (let i = 3; i <= n; i++) {\n        let current = prev1 + prev2;\n        prev1 = prev2;\n        prev2 = current;\n    }\n    return prev2;\n}" }
      },
      hints: ["This is similar to Fibonacci sequence", "Use bottom-up approach"],
      aiContext: "Classic dynamic programming problem with optimal substructure."
    },
    {
      id: 13,
      title: "Reverse Linked List",
      difficulty: "Easy",
      category: "Linked List",
      tags: ["Linked List", "Recursion"],
      companies: ["Facebook", "Amazon", "Microsoft"],
      isPremium: false,
      acceptanceRate: 69.8,
      totalSubmissions: 2123456,
      solvedCount: 1482219,
      youtubeUrl: "https://www.youtube.com/watch?v=G0_I-ZF0S38",
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nExample 1:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n\nExample 2:\nInput: head = [1,2]\nOutput: [2,1]\n\nExample 3:\nInput: head = []\nOutput: []",
      testCases: {
        visible: [
          { input: { head: [1,2,3,4,5] }, output: [5,4,3,2,1] },
          { input: { head: [1,2] }, output: [2,1] }
        ],
        hidden: [
          { input: { head: [] }, output: [] }
        ]
      },
      starterCode: {
        javascript: "function reverseList(head) {\n    // Your code here\n}",
        python: "def reverse_list(head):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Iterative",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Iterate through list and reverse links between nodes.",
        code: { javascript: "function reverseList(head) {\n    let prev = null;\n    let current = head;\n    while (current) {\n        let next = current.next;\n        current.next = prev;\n        prev = current;\n        current = next;\n    }\n    return prev;\n}" }
      },
      hints: ["Keep track of previous, current, and next nodes", "Reverse the links iteratively"],
      aiContext: "Fundamental linked list manipulation problem."
    },
    {
      id: 14,
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      category: "Dynamic Programming",
      tags: ["String", "Dynamic Programming"],
      companies: ["Google", "Amazon", "Microsoft"],
      isPremium: true,
      acceptanceRate: 58.3,
      totalSubmissions: 1456789,
      solvedCount: 849392,
      youtubeUrl: "https://www.youtube.com/watch?v=Ua0GhsJSlWM",
      description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nExample 1:\nInput: text1 = \"abcde\", text2 = \"ace\"\nOutput: 3\nExplanation: The longest common subsequence is \"ace\" and its length is 3.\n\nExample 2:\nInput: text1 = \"abc\", text2 = \"abc\"\nOutput: 3\nExplanation: The longest common subsequence is \"abc\" and its length is 3.\n\nExample 3:\nInput: text1 = \"abc\", text2 = \"def\"\nOutput: 0\nExplanation: There is no such common subsequence, so the result is 0.",
      testCases: {
        visible: [
          { input: { text1: "abcde", text2: "ace" }, output: 3 },
          { input: { text1: "abc", text2: "abc" }, output: 3 }
        ],
        hidden: [
          { input: { text1: "abc", text2: "def" }, output: 0 }
        ]
      },
      starterCode: {
        javascript: "function longestCommonSubsequence(text1, text2) {\n    // Your code here\n}",
        python: "def longest_common_subsequence(text1, text2):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "2D DP",
        timeComplexity: "O(m * n)",
        spaceComplexity: "O(m * n)",
        explanation: "Build DP table comparing characters from both strings.",
        code: { javascript: "function longestCommonSubsequence(text1, text2) {\n    const m = text1.length, n = text2.length;\n    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (text1[i-1] === text2[j-1]) {\n                dp[i][j] = dp[i-1][j-1] + 1;\n            } else {\n                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n            }\n        }\n    }\n    return dp[m][n];\n}" }
      },
      hints: ["Use 2D DP table", "If characters match, add 1 to diagonal"],
      aiContext: "Classic dynamic programming problem on strings."
    },
    {
      id: 15,
      title: "Word Search",
      difficulty: "Medium",
      category: "Backtracking",
      tags: ["Array", "Backtracking", "Matrix"],
      companies: ["Facebook", "Amazon", "Microsoft"],
      isPremium: false,
      acceptanceRate: 37.2,
      totalSubmissions: 1876543,
      solvedCount: 698106,
      youtubeUrl: "https://www.youtube.com/watch?v=pfiQ_PS1g8E",
      description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nExample 1:\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"\nOutput: true\n\nExample 2:\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"\nOutput: true\n\nExample 3:\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"\nOutput: false",
      testCases: {
        visible: [
          { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCCED" }, output: true },
          { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "SEE" }, output: true }
        ],
        hidden: [
          { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCB" }, output: false }
        ]
      },
      starterCode: {
        javascript: "function exist(board, word) {\n    // Your code here\n}",
        python: "def exist(board, word):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "DFS Backtracking",
        timeComplexity: "O(N * 4^L)",
        spaceComplexity: "O(L)",
        explanation: "Use DFS with backtracking to explore all paths.",
        code: { javascript: "function exist(board, word) {\n    const rows = board.length, cols = board[0].length;\n    \n    function dfs(i, j, index) {\n        if (index === word.length) return true;\n        if (i < 0 || i >= rows || j < 0 || j >= cols || board[i][j] !== word[index]) {\n            return false;\n        }\n        \n        const temp = board[i][j];\n        board[i][j] = '#'; // Mark as visited\n        \n        const found = dfs(i+1, j, index+1) || dfs(i-1, j, index+1) || \n                     dfs(i, j+1, index+1) || dfs(i, j-1, index+1);\n        \n        board[i][j] = temp; // Backtrack\n        return found;\n    }\n    \n    for (let i = 0; i < rows; i++) {\n        for (let j = 0; j < cols; j++) {\n            if (dfs(i, j, 0)) return true;\n        }\n    }\n    return false;\n}" }
      },
      hints: ["Use DFS with backtracking", "Mark visited cells temporarily"],
      aiContext: "Backtracking problem with grid traversal."
    },
    {
      id: 16,
      title: "Maximum Subarray",
      difficulty: "Medium",
      category: "Dynamic Programming",
      tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
      companies: ["Amazon", "Microsoft", "LinkedIn"],
      isPremium: false,
      acceptanceRate: 48.9,
      totalSubmissions: 2987654,
      solvedCount: 1461128,
      youtubeUrl: "https://www.youtube.com/watch?v=5WZl3MMT0Eg",
      description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1\nExplanation: [1] has the largest sum = 1.\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23\nExplanation: [5,4,-1,7,8] has the largest sum = 23.",
      testCases: {
        visible: [
          { input: { nums: [-2,1,-3,4,-1,2,1,-5,4] }, output: 6 },
          { input: { nums: [1] }, output: 1 }
        ],
        hidden: [
          { input: { nums: [5,4,-1,7,8] }, output: 23 }
        ]
      },
      starterCode: {
        javascript: "function maxSubArray(nums) {\n    // Your code here\n}",
        python: "def max_sub_array(nums):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Kadane's Algorithm",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        explanation: "Use Kadane's algorithm to find maximum subarray sum.",
        code: { javascript: "function maxSubArray(nums) {\n    let maxSoFar = nums[0];\n    let maxEndingHere = nums[0];\n    \n    for (let i = 1; i < nums.length; i++) {\n        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n        maxSoFar = Math.max(maxSoFar, maxEndingHere);\n    }\n    \n    return maxSoFar;\n}" }
      },
      hints: ["Use Kadane's algorithm", "At each step, decide whether to extend or start new subarray"],
      aiContext: "Classic dynamic programming problem using Kadane's algorithm."
    },
    {
      id: 17,
      title: "Palindromic Substrings",
      difficulty: "Medium",
      category: "String",
      tags: ["String", "Dynamic Programming"],
      companies: ["Facebook", "Amazon", "LinkedIn"],
      isPremium: false,
      acceptanceRate: 62.8,
      totalSubmissions: 1234567,
      solvedCount: 775451,
      youtubeUrl: "https://www.youtube.com/watch?v=4RACzI5-du8",
      description: "Given a string s, return the number of palindromic substrings in it.\n\nExample 1:\nInput: s = \"abc\"\nOutput: 3\nExplanation: Three palindromic strings: \"a\", \"b\", \"c\".\n\nExample 2:\nInput: s = \"aaa\"\nOutput: 6\nExplanation: Six palindromic strings: \"a\", \"a\", \"a\", \"aa\", \"aa\", \"aaa\".\n\nExample 3:\nInput: s = \"racecar\"\nOutput: 10\nExplanation: Ten palindromic strings: \"r\", \"a\", \"c\", \"e\", \"c\", \"a\", \"r\", \"cec\", \"aceca\", \"racecar\".",
      testCases: {
        visible: [
          { input: { s: "abc" }, output: 3 },
          { input: { s: "aaa" }, output: 6 }
        ],
        hidden: [
          { input: { s: "racecar" }, output: 10 }
        ]
      },
      starterCode: {
        javascript: "function countSubstrings(s) {\n    // Your code here\n}",
        python: "def count_substrings(s):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Expand Around Centers",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "For each possible center, expand outwards to count palindromes.",
        code: { javascript: "function countSubstrings(s) {\n    let count = 0;\n    \n    function expandAroundCenter(left, right) {\n        while (left >= 0 && right < s.length && s[left] === s[right]) {\n            count++;\n            left--;\n            right++;\n        }\n    }\n    \n    for (let i = 0; i < s.length; i++) {\n        expandAroundCenter(i, i); // Odd length palindromes\n        expandAroundCenter(i, i + 1); // Even length palindromes\n    }\n    \n    return count;\n}" }
      },
      hints: ["Expand around each possible center", "Consider both odd and even length palindromes"],
      aiContext: "String problem using expand around centers technique."
    },
    {
      id: 18,
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      category: "Linked List",
      tags: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"],
      companies: ["Amazon", "Facebook", "Google"],
      isPremium: true,
      acceptanceRate: 45.8,
      totalSubmissions: 1987654,
      solvedCount: 910453,
      youtubeUrl: "https://www.youtube.com/watch?v=q5a5OiGbT6Q",
      description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.\n\nExample 1:\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\nExplanation: The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list:\n1->1->2->3->4->4->5->6\n\nExample 2:\nInput: lists = []\nOutput: []\n\nExample 3:\nInput: lists = [[]]\nOutput: []",
      testCases: {
        visible: [
          { input: { lists: [[1,4,5],[1,3,4],[2,6]] }, output: [1,1,2,3,4,4,5,6] },
          { input: { lists: [] }, output: [] }
        ],
        hidden: [
          { input: { lists: [[]] }, output: [] }
        ]
      },
      starterCode: {
        javascript: "function mergeKLists(lists) {\n    // Your code here\n}",
        python: "def merge_k_lists(lists):\n    # Your code here\n    pass"
      },
      solution: {
        approach: "Divide and Conquer",
        timeComplexity: "O(N log k)",
        spaceComplexity: "O(log k)",
        explanation: "Use divide and conquer to merge lists pairwise.",
        code: { javascript: "function mergeKLists(lists) {\n    if (!lists || lists.length === 0) return null;\n    \n    function mergeTwoLists(l1, l2) {\n        let dummy = new ListNode(0);\n        let current = dummy;\n        \n        while (l1 && l2) {\n            if (l1.val <= l2.val) {\n                current.next = l1;\n                l1 = l1.next;\n            } else {\n                current.next = l2;\n                l2 = l2.next;\n            }\n            current = current.next;\n        }\n        \n        current.next = l1 || l2;\n        return dummy.next;\n    }\n    \n    while (lists.length > 1) {\n        let mergedLists = [];\n        for (let i = 0; i < lists.length; i += 2) {\n            let l1 = lists[i];\n            let l2 = i + 1 < lists.length ? lists[i + 1] : null;\n            mergedLists.push(mergeTwoLists(l1, l2));\n        }\n        lists = mergedLists;\n    }\n    \n    return lists[0];\n}" }
      },
      hints: ["Use divide and conquer approach", "Merge lists pairwise"],
      aiContext: "Advanced linked list problem using divide and conquer strategy."
    }
  ];
};

// Utility functions
export const filterProblems = (problems, filters) => {
  let filtered = [...problems];

  if (filters.difficulty && filters.difficulty.length > 0) {
    filtered = filtered.filter(p => filters.difficulty.includes(p.difficulty));
  }

  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(p => filters.category.includes(p.category));
  }

  if (filters.companies && filters.companies.length > 0) {
    filtered = filtered.filter(p => p.companies.some(company => filters.companies.includes(company)));
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(p => p.tags.some(tag => filters.tags.includes(tag)));
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  if (filters.premiumOnly) {
    filtered = filtered.filter(p => p.isPremium);
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'acceptance':
          return b.acceptanceRate - a.acceptanceRate;
        case 'submissions':
          return b.totalSubmissions - a.totalSubmissions;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }

  return filtered;
};

export const getUserProgress = (userId) => {
  return {
    bookmarkedProblems: [1],
    likedProblems: [1, 2],
    solvedProblems: [],
    premiumAccess: Math.random() > 0.5
  };
};

export const toggleBookmark = (userId, problemId) => {
  return { success: true, isBookmarked: Math.random() > 0.5 };
};

export const toggleLike = (userId, problemId) => {
  return { success: true, isLiked: Math.random() > 0.5 };
};

export const getAllCompanies = () => {
  const problems = getNewProblems();
  const companies = new Set();
  problems.forEach(problem => {
    problem.companies.forEach(company => companies.add(company));
  });
  return Array.from(companies).sort();
};

export const getAllTags = () => {
  const problems = getNewProblems();
  const tags = new Set();
  problems.forEach(problem => {
    problem.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const getAllCategories = () => {
  const problems = getNewProblems();
  const categories = new Set();
  problems.forEach(problem => {
    categories.add(problem.category);
  });
  return Array.from(categories).sort();
};

// AI Knowledge function for AI assistant
export const getAIKnowledge = (problemId) => {
  const problems = getNewProblems();
  const problem = problems.find(p => p.id === problemId);
  
  if (!problem) return null;
  
  return {
    concept: problem.category,
    approaches: problem.solution?.approach || 'Multiple approaches possible',
    timeComplexity: problem.solution?.timeComplexity || 'Varies',
    spaceComplexity: problem.solution?.spaceComplexity || 'Varies',
    patterns: problem.tags.join(', '),
    relatedTopics: problem.tags,
    aiContext: problem.aiContext || 'General problem solving context'
  };
};

// Contextual hints function for AI assistant
export const getContextualHints = (problemId, userCode = '') => {
  const problems = getNewProblems();
  const problem = problems.find(p => p.id === problemId);
  
  if (!problem) return [];
  
  const baseHints = problem.hints || [];
  
  // Add contextual hints based on problem category
  const contextualHints = [];
  
  if (problem.category === 'Array') {
    contextualHints.push('Consider using hash maps for O(1) lookups');
    contextualHints.push('Think about two-pointer technique for sorted arrays');
  } else if (problem.category === 'Stack') {
    contextualHints.push('Stack follows LIFO (Last In, First Out) principle');
    contextualHints.push('Consider using array as stack with push/pop operations');
  } else if (problem.category === 'Tree') {
    contextualHints.push('Consider recursive approach for tree traversal');
    contextualHints.push('Think about DFS vs BFS based on the problem requirements');
  }
  
  return [...baseHints, ...contextualHints];
};
