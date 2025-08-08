// Mock data for problems - comprehensive problem set with premium features
export const getMockProblems = () => {
  return [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      acceptance_rate: "56.1%",
      tags: ["Array", "Hash Table"],
      companies: ["Amazon", "Google", "Microsoft", "Facebook", "Apple"],
      solved_count: 3500000,
      total_submissions: 6250000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
      hints: ["Use a hash map to store complements", "For each number, check if its complement exists in the hash map"]
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium",
      acceptance_rate: "46.6%",
      tags: ["Linked List", "Math", "Recursion"],
      companies: ["Microsoft", "Amazon", "Bloomberg", "Adobe"],
      solved_count: 1800000,
      total_submissions: 3900000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
      examples: [
        {
          input: "l1 = [2,4,3], l2 = [5,6,4]",
          output: "[7,0,8]",
          explanation: "342 + 465 = 807."
        }
      ],
      constraints: ["The number of nodes in each linked list is in the range [1, 100]", "0 <= Node.val <= 9"],
      hints: ["Handle carry-over carefully", "Create a dummy node to simplify code", "Don't forget the final carry"]
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      acceptance_rate: "37.2%",
      tags: ["String", "Sliding Window", "Hash Table"],
      companies: ["Amazon", "Bloomberg", "Yelp", "Adobe"],
      solved_count: 1200000,
      total_submissions: 3200000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: 'The answer is "abc", with the length of 3.'
        }
      ],
      constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"],
      hints: ["Use sliding window technique", "Use a hash set to track characters in current window", "Move the start pointer when duplicate is found"]
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      acceptance_rate: "44.3%",
      tags: ["Array", "Binary Search", "Divide and Conquer"],
      companies: ["Google", "Microsoft", "Apple", "Uber"],
      solved_count: 800000,
      total_submissions: 1800000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      examples: [
        {
          input: "nums1 = [1,3], nums2 = [2]",
          output: "2.00000",
          explanation: "merged array = [1,2,3] and median is 2."
        }
      ],
      constraints: ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000"],
      hints: ["Use binary search for O(log(min(m,n))) solution", "Find the correct partition point", "Ensure left partition <= right partition"]
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      acceptance_rate: "36.1%",
      tags: ["String", "Dynamic Programming"],
      companies: ["Amazon", "Microsoft", "Uber", "Palantir"],
      solved_count: 1100000,
      total_submissions: 3000000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given a string s, return the longest palindromic substring in s.",
      examples: [
        {
          input: 's = "babad"',
          output: '"bab"',
          explanation: 'Note: "aba" is also a valid answer.'
        }
      ],
      constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters"],
      hints: ["Expand around centers approach", "Consider both odd and even length palindromes", "Dynamic programming approach is also possible"]
    },
    {
      id: 6,
      title: "Valid Parentheses",
      difficulty: "Easy",
      acceptance_rate: "52.0%",
      tags: ["String", "Stack"],
      companies: ["Amazon", "Google", "Microsoft", "Bloomberg"],
      solved_count: 2500000,
      total_submissions: 4800000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: [
        {
          input: 's = "()"',
          output: "true",
          explanation: "The string is valid."
        }
      ],
      constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
      hints: ["Use a stack to keep track of opening brackets", "Match each closing bracket with the most recent opening bracket"]
    },
    {
      id: 7,
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      acceptance_rate: "68.4%",
      tags: ["Linked List", "Recursion"],
      companies: ["Amazon", "LinkedIn", "Apple", "Adobe"],
      solved_count: 2200000,
      total_submissions: 3200000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
      examples: [
        {
          input: "list1 = [1,2,4], list2 = [1,3,4]",
          output: "[1,1,2,3,4,4]",
          explanation: "The merged list is sorted."
        }
      ],
      constraints: ["The number of nodes in both lists is in the range [0, 50]", "-100 <= Node.val <= 100"],
      hints: ["Use a dummy node to simplify the logic", "Compare values and advance the smaller one", "Handle remaining nodes after one list is exhausted"]
    },
    {
      id: 8,
      title: "Maximum Subarray",
      difficulty: "Medium",
      acceptance_rate: "54.2%",
      tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
      companies: ["Amazon", "Microsoft", "LinkedIn", "Bloomberg"],
      solved_count: 1800000,
      total_submissions: 3300000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      examples: [
        {
          input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          output: "6",
          explanation: "[4,-1,2,1] has the largest sum = 6."
        }
      ],
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      hints: ["Kadane's algorithm is perfect for this", "Keep track of current sum and maximum sum", "Reset current sum when it becomes negative"]
    },
    {
      id: 9,
      title: "Climbing Stairs",
      difficulty: "Easy",
      acceptance_rate: "70.1%",
      tags: ["Math", "Dynamic Programming", "Memoization"],
      companies: ["Amazon", "Adobe", "Uber"],
      solved_count: 2800000,
      total_submissions: 4000000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      examples: [
        {
          input: "n = 2",
          output: "2",
          explanation: "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps"
        }
      ],
      constraints: ["1 <= n <= 45"],
      hints: ["This is essentially a Fibonacci sequence", "f(n) = f(n-1) + f(n-2)", "Can be solved with dynamic programming or math"]
    },
    {
      id: 10,
      title: "Binary Tree Inorder Traversal",
      difficulty: "Easy",
      acceptance_rate: "75.8%",
      tags: ["Stack", "Tree", "Depth-First Search"],
      companies: ["Microsoft", "Amazon", "Facebook"],
      solved_count: 1900000,
      total_submissions: 2500000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      examples: [
        {
          input: "root = [1,null,2,3]",
          output: "[1,3,2]",
          explanation: "Inorder traversal visits left, root, right."
        }
      ],
      constraints: ["The number of nodes in the tree is in the range [0, 100]", "-100 <= Node.val <= 100"],
      hints: ["Recursive solution is straightforward", "For iterative: use a stack", "Visit left subtree, root, then right subtree"]
    },
    {
      id: 11,
      title: "Container With Most Water",
      difficulty: "Medium",
      acceptance_rate: "58.0%",
      tags: ["Array", "Two Pointers", "Greedy"],
      companies: ["Amazon", "Bloomberg", "Adobe"],
      solved_count: 1600000,
      total_submissions: 2750000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that can hold the most water.",
      examples: [
        {
          input: "height = [1,8,6,2,5,4,8,3,7]",
          output: "49",
          explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49."
        }
      ],
      constraints: ["n >= 2", "0 <= height[i] <= 3 * 10^4"],
      hints: ["Use two pointers approach", "Move the pointer with smaller height", "Calculate area at each step and keep track of maximum"]
    },
    {
      id: 12,
      title: "3Sum",
      difficulty: "Medium",
      acceptance_rate: "37.4%",
      tags: ["Array", "Two Pointers", "Sorting"],
      companies: ["Amazon", "Adobe", "Facebook", "Apple"],
      solved_count: 1200000,
      total_submissions: 3200000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      examples: [
        {
          input: "nums = [-1,0,1,2,-1,-4]",
          output: "[[-1,-1,2],[-1,0,1]]",
          explanation: "The distinct triplets are [-1,0,1] and [-1,-1,2]."
        }
      ],
      constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
      hints: ["Sort the array first", "Use two pointers for each fixed element", "Skip duplicates to avoid duplicate triplets"]
    },
    {
      id: 13,
      title: "Letter Combinations of a Phone Number",
      difficulty: "Medium",
      acceptance_rate: "58.7%",
      tags: ["Hash Table", "String", "Backtracking"],
      companies: ["Amazon", "Google", "Uber", "Dropbox"],
      solved_count: 1400000,
      total_submissions: 2400000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.",
      examples: [
        {
          input: 'digits = "23"',
          output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
          explanation: "2 maps to abc, 3 maps to def."
        }
      ],
      constraints: ["0 <= digits.length <= 4", "digits[i] is a digit in the range ['2', '9']"],
      hints: ["Use backtracking to generate all combinations", "Map each digit to its corresponding letters", "Build combinations character by character"]
    },
    {
      id: 14,
      title: "Remove Nth Node From End of List",
      difficulty: "Medium",
      acceptance_rate: "43.2%",
      tags: ["Linked List", "Two Pointers"],
      companies: ["Amazon", "Microsoft", "Adobe"],
      solved_count: 1100000,
      total_submissions: 2550000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
      examples: [
        {
          input: "head = [1,2,3,4,5], n = 2",
          output: "[1,2,3,5]",
          explanation: "Remove the 2nd node from the end."
        }
      ],
      constraints: ["The number of nodes in the list is sz", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"],
      hints: ["Use two pointers with n gap between them", "Move both pointers until the fast one reaches the end", "The slow pointer will be at the node to remove"]
    },
    {
      id: 15,
      title: "Generate Parentheses",
      difficulty: "Medium",
      acceptance_rate: "73.8%",
      tags: ["String", "Dynamic Programming", "Backtracking"],
      companies: ["Amazon", "Google", "Uber", "Facebook"],
      solved_count: 1300000,
      total_submissions: 1760000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
      examples: [
        {
          input: "n = 3",
          output: '["((()))","(()())","(())()","()(())","()()()"]',
          explanation: "All valid combinations of 3 pairs of parentheses."
        }
      ],
      constraints: ["1 <= n <= 8"],
      hints: ["Use backtracking to generate valid combinations", "Track the count of open and close parentheses", "Only add ')' when there are unmatched '(' before it"]
    },
    {
      id: 16,
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      acceptance_rate: "51.1%",
      tags: ["Linked List", "Divide and Conquer", "Heap"],
      companies: ["Amazon", "Google", "Microsoft", "Facebook"],
      solved_count: 900000,
      total_submissions: 1760000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      examples: [
        {
          input: "lists = [[1,4,5],[1,3,4],[2,6]]",
          output: "[1,1,2,3,4,4,5,6]",
          explanation: "The linked-lists are merged into one sorted list."
        }
      ],
      constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500"],
      hints: ["Use a min-heap to track the smallest elements", "Divide and conquer approach: merge pairs of lists", "Compare and merge two lists at a time"]
    },
    {
      id: 17,
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      acceptance_rate: "41.8%",
      tags: ["Array", "Binary Search"],
      companies: ["Amazon", "Microsoft", "Facebook", "LinkedIn"],
      solved_count: 1100000,
      total_submissions: 2630000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
      examples: [
        {
          input: "nums = [4,5,6,7,0,1,2], target = 0",
          output: "4",
          explanation: "0 is found at index 4."
        }
      ],
      constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique"],
      hints: ["Use modified binary search", "Determine which half is sorted", "Check if target is in the sorted half"]
    },
    {
      id: 18,
      title: "Combination Sum",
      difficulty: "Medium",
      acceptance_rate: "70.4%",
      tags: ["Array", "Backtracking"],
      companies: ["Amazon", "Adobe", "Airbnb"],
      solved_count: 1200000,
      total_submissions: 1700000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.",
      examples: [
        {
          input: "candidates = [2,3,6,7], target = 7",
          output: "[[2,2,3],[7]]",
          explanation: "2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times."
        }
      ],
      constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "1 <= target <= 40"],
      hints: ["Use backtracking to explore all combinations", "Sort the array to optimize pruning", "Allow reuse of the same number"]
    },
    {
      id: 19,
      title: "Trapping Rain Water",
      difficulty: "Hard",
      acceptance_rate: "62.0%",
      tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
      companies: ["Amazon", "Google", "Microsoft", "Facebook"],
      solved_count: 950000,
      total_submissions: 1530000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      examples: [
        {
          input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
          output: "6",
          explanation: "The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped."
        }
      ],
      constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 3 * 10^4"],
      hints: ["Two pointers approach with left_max and right_max", "Water level at each position depends on min(left_max, right_max)", "Move pointer with smaller max value"]
    },
    {
      id: 20,
      title: "Group Anagrams",
      difficulty: "Medium",
      acceptance_rate: "67.8%",
      tags: ["Array", "Hash Table", "String", "Sorting"],
      companies: ["Amazon", "Uber", "Facebook"],
      solved_count: 1400000,
      total_submissions: 2060000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      examples: [
        {
          input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
          output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
          explanation: "Words that are anagrams of each other are grouped together."
        }
      ],
      constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100"],
      hints: ["Use sorted string as key in hash map", "Group strings with same sorted characters", "Alternatively, use character frequency as key"]
    },
    {
      id: 21,
      title: "Permutations",
      difficulty: "Medium",
      acceptance_rate: "77.6%",
      tags: ["Array", "Backtracking"],
      companies: ["Amazon", "Microsoft", "LinkedIn"],
      solved_count: 1500000,
      total_submissions: 1930000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
      examples: [
        {
          input: "nums = [1,2,3]",
          output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
          explanation: "All possible permutations of [1,2,3]."
        }
      ],
      constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All the integers of nums are unique"],
      hints: ["Use backtracking to generate all permutations", "Swap elements to generate different arrangements", "Track which elements are already used"]
    },
    {
      id: 22,
      title: "Rotate Image",
      difficulty: "Medium",
      acceptance_rate: "71.9%",
      tags: ["Array", "Math", "Matrix"],
      companies: ["Amazon", "Microsoft", "Apple"],
      solved_count: 1200000,
      total_submissions: 1670000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.",
      examples: [
        {
          input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
          output: "[[7,4,1],[8,5,2],[9,6,3]]",
          explanation: "Rotate the matrix 90 degrees clockwise."
        }
      ],
      constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20", "-1000 <= matrix[i][j] <= 1000"],
      hints: ["Transpose the matrix first", "Then reverse each row", "Or rotate layer by layer from outside to inside"]
    },
    {
      id: 23,
      title: "Spiral Matrix",
      difficulty: "Medium",
      acceptance_rate: "48.0%",
      tags: ["Array", "Matrix", "Simulation"],
      companies: ["Amazon", "Microsoft", "Google"],
      solved_count: 800000,
      total_submissions: 1670000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
      examples: [
        {
          input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
          output: "[1,2,3,6,9,8,7,4,5]",
          explanation: "Elements are returned in spiral order."
        }
      ],
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],
      hints: ["Use four boundaries: top, bottom, left, right", "Move in spiral order and update boundaries", "Continue until all elements are visited"]
    },
    {
      id: 24,
      title: "Jump Game",
      difficulty: "Medium",
      acceptance_rate: "38.7%",
      tags: ["Array", "Dynamic Programming", "Greedy"],
      companies: ["Amazon", "Microsoft", "Facebook"],
      solved_count: 1000000,
      total_submissions: 2580000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
      examples: [
        {
          input: "nums = [2,3,1,1,4]",
          output: "true",
          explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index."
        }
      ],
      constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
      hints: ["Use greedy approach", "Keep track of the furthest reachable position", "If current position > furthest reachable, return false"]
    },
    {
      id: 25,
      title: "Merge Intervals",
      difficulty: "Medium",
      acceptance_rate: "48.3%",
      tags: ["Array", "Sorting"],
      companies: ["Amazon", "Google", "Facebook", "Microsoft"],
      solved_count: 1100000,
      total_submissions: 2280000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      examples: [
        {
          input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
          output: "[[1,6],[8,10],[15,18]]",
          explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
        }
      ],
      constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^4"],
      hints: ["Sort intervals by start time", "Merge overlapping intervals as you iterate", "Check if current interval overlaps with the last merged interval"]
    },
    {
      id: 26,
      title: "Unique Paths",
      difficulty: "Medium",
      acceptance_rate: "63.8%",
      tags: ["Math", "Dynamic Programming", "Combinatorics"],
      companies: ["Amazon", "Google", "Bloomberg"],
      solved_count: 1300000,
      total_submissions: 2040000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
      examples: [
        {
          input: "m = 3, n = 7",
          output: "28",
          explanation: "There are 28 unique paths from top-left to bottom-right."
        }
      ],
      constraints: ["1 <= m, n <= 100"],
      hints: ["Use dynamic programming", "dp[i][j] = dp[i-1][j] + dp[i][j-1]", "Can be optimized using combinatorics formula"]
    },
    {
      id: 27,
      title: "Minimum Path Sum",
      difficulty: "Medium",
      acceptance_rate: "63.5%",
      tags: ["Array", "Dynamic Programming", "Matrix"],
      companies: ["Amazon", "Google", "Microsoft"],
      solved_count: 900000,
      total_submissions: 1420000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. Note: You can only move either down or right at any point in time.",
      examples: [
        {
          input: "grid = [[1,3,1],[1,5,1],[4,2,1]]",
          output: "7",
          explanation: "Because the path 1 → 3 → 1 → 1 → 1 minimizes the sum."
        }
      ],
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 200", "0 <= grid[i][j] <= 200"],
      hints: ["Use dynamic programming", "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])", "Can be optimized to use O(n) space"]
    },
    {
      id: 28,
      title: "Edit Distance",
      difficulty: "Hard",
      acceptance_rate: "54.9%",
      tags: ["String", "Dynamic Programming"],
      companies: ["Amazon", "Google", "Microsoft", "Facebook"],
      solved_count: 600000,
      total_submissions: 1090000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
      examples: [
        {
          input: 'word1 = "horse", word2 = "ros"',
          output: "3",
          explanation: "horse -> rorse (replace 'h' with 'r'), rorse -> rose (remove 'r'), rose -> ros (remove 'e')"
        }
      ],
      constraints: ["0 <= word1.length, word2.length <= 500", "word1 and word2 consist of lowercase English letters"],
      hints: ["Use 2D dynamic programming", "dp[i][j] represents min operations to convert word1[0:i] to word2[0:j]", "Consider three operations: insert, delete, replace"]
    },
    {
      id: 29,
      title: "Set Matrix Zeroes",
      difficulty: "Medium",
      acceptance_rate: "55.4%",
      tags: ["Array", "Hash Table", "Matrix"],
      companies: ["Amazon", "Microsoft", "Adobe"],
      solved_count: 800000,
      total_submissions: 1440000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's. You must do it in place.",
      examples: [
        {
          input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
          output: "[[1,0,1],[0,0,0],[1,0,1]]",
          explanation: "The 0 at position (1,1) zeros out row 1 and column 1."
        }
      ],
      constraints: ["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200", "-2^31 <= matrix[i][j] <= 2^31 - 1"],
      hints: ["Use first row and column as markers", "Scan matrix to mark rows and columns", "Set zeros based on markers"]
    },
    {
      id: 30,
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      acceptance_rate: "48.7%",
      tags: ["Array", "Binary Search", "Matrix"],
      companies: ["Amazon", "Microsoft", "LinkedIn"],
      solved_count: 950000,
      total_submissions: 1950000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "You are given an m x n integer matrix matrix with the following two properties: Each row is sorted in non-decreasing order. The first integer of each row is greater than the last integer of the previous row. Given an integer target, return true if target is in matrix or false otherwise.",
      examples: [
        {
          input: "matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5",
          output: "true",
          explanation: "5 is found in the matrix."
        }
      ],
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
      hints: ["Treat the 2D matrix as a 1D sorted array", "Use binary search with coordinate conversion", "Convert 1D index to 2D coordinates: row = idx // n, col = idx % n"]
    },
    {
      id: 31,
      title: "Sort Colors",
      difficulty: "Medium",
      acceptance_rate: "61.4%",
      tags: ["Array", "Two Pointers", "Sorting"],
      companies: ["Amazon", "Microsoft", "Facebook"],
      solved_count: 1100000,
      total_submissions: 1790000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.",
      examples: [
        {
          input: "nums = [2,0,2,1,1,0]",
          output: "[0,0,1,1,2,2]",
          explanation: "Colors are sorted in order."
        }
      ],
      constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is either 0, 1, or 2"],
      hints: ["Use Dutch National Flag algorithm", "Three pointers: low, mid, high", "Partition array into three sections"]
    },
    {
      id: 32,
      title: "Minimum Window Substring",
      difficulty: "Hard",
      acceptance_rate: "42.1%",
      tags: ["Hash Table", "String", "Sliding Window"],
      companies: ["Amazon", "Google", "Microsoft", "Facebook"],
      solved_count: 650000,
      total_submissions: 1540000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string ''.",
      examples: [
        {
          input: 's = "ADOBECODEBANC", t = "ABC"',
          output: '"BANC"',
          explanation: "The minimum window substring 'BANC' includes all characters of t."
        }
      ],
      constraints: ["m == s.length", "n == t.length", "1 <= m, n <= 10^5", "s and t consist of uppercase and lowercase English letters"],
      hints: ["Use sliding window technique", "Expand window until all characters of t are included", "Contract window while maintaining validity"]
    },
    {
      id: 33,
      title: "Combinations",
      difficulty: "Medium",
      acceptance_rate: "73.0%",
      tags: ["Backtracking"],
      companies: ["Amazon", "Google", "Microsoft"],
      solved_count: 900000,
      total_submissions: 1230000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n]. You may return the answer in any order.",
      examples: [
        {
          input: "n = 4, k = 2",
          output: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]",
          explanation: "All possible combinations of 2 numbers from 1 to 4."
        }
      ],
      constraints: ["1 <= n <= 20", "1 <= k <= n"],
      hints: ["Use backtracking to generate combinations", "Start from the next number to avoid duplicates", "Prune early if remaining numbers are insufficient"]
    },
    {
      id: 34,
      title: "Subsets",
      difficulty: "Medium",
      acceptance_rate: "77.8%",
      tags: ["Array", "Backtracking", "Bit Manipulation"],
      companies: ["Amazon", "Facebook", "Google"],
      solved_count: 1200000,
      total_submissions: 1540000,
      bookmarked: false,
      liked: false,
      premium: false,
      description: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
      examples: [
        {
          input: "nums = [1,2,3]",
          output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
          explanation: "All possible subsets of [1,2,3]."
        }
      ],
      constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All the numbers of nums are unique"],
      hints: ["Use backtracking approach", "For each element, choose to include or exclude it", "Bit manipulation approach: each bit represents inclusion of an element"]
    },
    {
      id: 35,
      title: "Word Search",
      difficulty: "Medium",
      acceptance_rate: "40.8%",
      tags: ["Array", "Backtracking", "Matrix"],
      companies: ["Amazon", "Microsoft", "Facebook"],
      solved_count: 800000,
      total_submissions: 1960000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
      examples: [
        {
          input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
          output: "true",
          explanation: "The word ABCCED can be found in the grid."
        }
      ],
      constraints: ["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15"],
      hints: ["Use DFS with backtracking", "Mark visited cells and unmark when backtracking", "Try all four directions from each cell"]
    },
    {
      id: 36,
      title: "Largest Rectangle in Histogram",
      difficulty: "Hard",
      acceptance_rate: "43.2%",
      tags: ["Array", "Stack", "Monotonic Stack"],
      companies: ["Amazon", "Google", "Microsoft"],
      solved_count: 550000,
      total_submissions: 1270000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      examples: [
        {
          input: "heights = [2,1,5,6,2,3]",
          output: "10",
          explanation: "The largest rectangle is formed by heights [5,6] with width 2, so area = 5 * 2 = 10."
        }
      ],
      constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
      hints: ["Use stack to find previous and next smaller elements", "For each bar, calculate max rectangle with that bar as the smallest", "Stack maintains indices in increasing order of heights"]
    },
    {
      id: 37,
      title: "Maximal Rectangle",
      difficulty: "Hard",
      acceptance_rate: "50.1%",
      tags: ["Array", "Dynamic Programming", "Stack", "Matrix"],
      companies: ["Amazon", "Google", "Facebook"],
      solved_count: 400000,
      total_submissions: 800000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "Given a rows x cols binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.",
      examples: [
        {
          input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',
          output: "6",
          explanation: "The maximal rectangle has area 6."
        }
      ],
      constraints: ["rows == matrix.length", "cols == matrix[i].length", "1 <= row, cols <= 200"],
      hints: ["Transform each row into histogram heights", "Apply largest rectangle in histogram for each row", "Heights[i][j] = matrix[i][j] == '1' ? heights[i-1][j] + 1 : 0"]
    },
    {
      id: 38,
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      acceptance_rate: "40.6%",
      tags: ["Dynamic Programming", "Tree", "Depth-First Search"],
      companies: ["Amazon", "Google", "Microsoft", "Facebook"],
      solved_count: 650000,
      total_submissions: 1600000,
      bookmarked: false,
      liked: false,
      premium: true,
      description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. The path sum of a path is the sum of the node's values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.",
      examples: [
        {
          input: "root = [1,2,3]",
          output: "6",
          explanation: "The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6."
        }
      ],
      constraints: ["The number of nodes in the tree is in the range [1, 3 * 10^4]", "-1000 <= Node.val <= 1000"],
      hints: ["Use recursive DFS approach", "For each node, calculate max path sum through that node", "Track global maximum and local maximum separately"]
    }
  ];
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'text-green-500';
    case 'medium':
      return 'text-yellow-500';
    case 'hard':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getDifficultyBg = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get company color for consistency
export const getCompanyColor = (company) => {
  const colors = {
    'Amazon': 'bg-orange-100 text-orange-800',
    'Google': 'bg-blue-100 text-blue-800',
    'Microsoft': 'bg-green-100 text-green-800',
    'Facebook': 'bg-blue-100 text-blue-800',
    'Apple': 'bg-gray-100 text-gray-800',
    'Netflix': 'bg-red-100 text-red-800',
    'Uber': 'bg-black text-white',
    'LinkedIn': 'bg-blue-100 text-blue-800',
    'Tesla': 'bg-red-100 text-red-800',
    'Airbnb': 'bg-pink-100 text-pink-800',
    'Spotify': 'bg-green-100 text-green-800',
    'Dropbox': 'bg-blue-100 text-blue-800',
    'Twitter': 'bg-blue-100 text-blue-800',
    'ByteDance': 'bg-gray-100 text-gray-800',
    'Salesforce': 'bg-blue-100 text-blue-800',
    'PayPal': 'bg-blue-100 text-blue-800',
    'Bloomberg': 'bg-orange-100 text-orange-800',
    'Adobe': 'bg-red-100 text-red-800',
    'Yelp': 'bg-red-100 text-red-800',
    'Palantir': 'bg-gray-100 text-gray-800',
    'Yahoo': 'bg-purple-100 text-purple-800'
  };
  return colors[company] || 'bg-gray-100 text-gray-800';
};

// Toggle bookmark function for real-time updates
export const toggleBookmark = async (problemId, session) => {
  try {
    if (!session) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`/api/problems/${problemId}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return { success: false, error: error.message };
  }
};

// Toggle like function for real-time updates
export const toggleLike = async (problemId, session) => {
  try {
    if (!session) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`/api/problems/${problemId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message };
  }
};

// Get user bookmarks for real-time state
export const getUserBookmarks = async (session) => {
  try {
    if (!session) return [];

    const response = await fetch('/api/user/bookmarks');
    const data = await response.json();
    return data.success ? data.bookmarks : [];
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
};

// Get random problem
export const getRandomProblem = (problems = null) => {
  const problemList = problems || getMockProblems();
  const randomIndex = Math.floor(Math.random() * problemList.length);
  return problemList[randomIndex];
};

// Calculate real-time statistics
export const calculateStats = (problems, session) => {
  const stats = {
    total: problems.length,
    solved: 0,
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
    bookmarked: 0,
    liked: 0
  };

  problems.forEach(problem => {
    const difficulty = problem.difficulty?.toLowerCase();

    // Count by difficulty
    if (difficulty === 'easy') {
      stats.easy.total++;
      if (problem.solved) stats.easy.solved++;
    } else if (difficulty === 'medium') {
      stats.medium.total++;
      if (problem.solved) stats.medium.solved++;
    } else if (difficulty === 'hard') {
      stats.hard.total++;
      if (problem.solved) stats.hard.solved++;
    }

    // Count solved
    if (problem.solved) stats.solved++;

    // Count bookmarked and liked
    if (problem.bookmarked) stats.bookmarked++;
    if (problem.liked) stats.liked++;
  });

  return stats;
};

// Check if user has premium access
export const checkPremiumAccess = (session) => {
  return session?.user?.isPremium || false;
};

// Filter problems based on premium access
export const filterProblemsForUser = (problems, session) => {
  const hasPremium = checkPremiumAccess(session);

  if (hasPremium) {
    return problems; // Premium users can see all problems
  }

  // Free users can see non-premium problems
  return problems.map(problem =>
    problem.premium
      ? { ...problem, locked: true, description: 'This is a premium problem. Upgrade to access.' }
      : problem
  );
};
