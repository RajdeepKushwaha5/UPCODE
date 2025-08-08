/**
 * Problem Seeder Script
 * Seeds 20 high-quality coding problems with comprehensive test cases
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'codegamy';

// 20 Comprehensive Coding Problems
const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
    <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
    <p>You can return the answer in any order.</p>`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: [0, 1],
        explanation: "nums[0] + nums[1] = 2 + 7 = 9"
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        output: [1, 2],
        explanation: "nums[1] + nums[2] = 2 + 4 = 6"
      },
      {
        input: { nums: [3, 3], target: 6 },
        output: [0, 1],
        explanation: "nums[0] + nums[1] = 3 + 3 = 6"
      }
    ],
    companies: ["Google", "Amazon", "Microsoft", "Facebook", "Apple"],
    tags: ["Array", "Hash Table"],
    likes: 12543,
    dislikes: 421,
    submissions: 2547632,
    acceptanceRate: 49.2
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: `<p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
    <p>An input string is valid if:</p>
    <ol>
    <li>Open brackets must be closed by the same type of brackets.</li>
    <li>Open brackets must be closed in the correct order.</li>
    </ol>`,
    examples: [
      {
        input: "s = \"()\"",
        output: "true",
        explanation: "The string contains valid parentheses."
      },
      {
        input: "s = \"()[]{}\"",
        output: "true",
        explanation: "All brackets are properly matched and nested."
      },
      {
        input: "s = \"(]\"",
        output: "false",
        explanation: "Mismatched bracket types."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    testCases: [
      { input: { s: "()" }, output: true },
      { input: { s: "()[]{})" }, output: true },
      { input: { s: "(]" }, output: false },
      { input: { s: "([)]" }, output: false },
      { input: { s: "{[]}" }, output: true },
      { input: { s: "" }, output: true }
    ],
    companies: ["Amazon", "Microsoft", "Google", "Facebook"],
    tags: ["String", "Stack"],
    likes: 8965,
    dislikes: 287,
    submissions: 1823456,
    acceptanceRate: 42.1
  },
  {
    id: 3,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `<p>Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return <em>its sum</em>.</p>
    <p>A <strong>subarray</strong> is a contiguous part of an array.</p>`,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The array has only one element."
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The entire array has the largest sum."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, output: 6 },
      { input: { nums: [1] }, output: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, output: 23 },
      { input: { nums: [-1] }, output: -1 },
      { input: { nums: [-2, -1] }, output: -1 }
    ],
    companies: ["Amazon", "Microsoft", "Apple", "Google"],
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    likes: 15432,
    dislikes: 756,
    submissions: 2156789,
    acceptanceRate: 48.9
  },
  {
    id: 4,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    category: "Tree",
    description: `<p>Given the <code>root</code> of a binary tree, return <em>the inorder traversal of its nodes' values</em>.</p>`,
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: "Inorder traversal visits left subtree, root, then right subtree."
      },
      {
        input: "root = []",
        output: "[]",
        explanation: "Empty tree returns empty array."
      },
      {
        input: "root = [1]",
        output: "[1]",
        explanation: "Single node tree."
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    testCases: [
      { input: { root: [1, null, 2, 3] }, output: [1, 3, 2] },
      { input: { root: [] }, output: [] },
      { input: { root: [1] }, output: [1] },
      { input: { root: [1, 2, 3, 4, 5] }, output: [4, 2, 5, 1, 3] }
    ],
    companies: ["Microsoft", "Amazon", "Google", "Facebook"],
    tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"],
    likes: 7234,
    dislikes: 312,
    submissions: 1456789,
    acceptanceRate: 74.2
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "String",
    description: `<p>Given a string <code>s</code>, return <em>the longest palindromic substring</em> in <code>s</code>.</p>
    <p>A <strong>palindrome</strong> is a string that reads the same forward and backward.</p>`,
    examples: [
      {
        input: "s = \"babad\"",
        output: "\"bab\"",
        explanation: "\"aba\" is also a valid answer."
      },
      {
        input: "s = \"cbbd\"",
        output: "\"bb\"",
        explanation: "The longest palindromic substring is \"bb\"."
      }
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    testCases: [
      { input: { s: "babad" }, output: "bab" },
      { input: { s: "cbbd" }, output: "bb" },
      { input: { s: "a" }, output: "a" },
      { input: { s: "ac" }, output: "a" },
      { input: { s: "racecar" }, output: "racecar" }
    ],
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    tags: ["String", "Dynamic Programming"],
    likes: 18765,
    dislikes: 1098,
    submissions: 3234567,
    acceptanceRate: 32.1
  },
  {
    id: 6,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    description: `<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.</p>
    <p>Merge the two lists into one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists.</p>
    <p>Return <em>the head of the merged linked list</em>.</p>`,
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Merging two sorted lists results in a sorted list."
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
        explanation: "Both lists are empty."
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]",
        explanation: "One list is empty."
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    testCases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, output: [1, 1, 2, 3, 4, 4] },
      { input: { list1: [], list2: [] }, output: [] },
      { input: { list1: [], list2: [0] }, output: [0] },
      { input: { list1: [1], list2: [2] }, output: [1, 2] }
    ],
    companies: ["Amazon", "Microsoft", "Apple", "Google"],
    tags: ["Linked List", "Recursion"],
    likes: 11234,
    dislikes: 456,
    submissions: 2789456,
    acceptanceRate: 61.8
  },
  {
    id: 7,
    title: "3Sum",
    difficulty: "Medium",
    category: "Array",
    description: `<p>Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>
    <p>Notice that the solution set must not contain duplicate triplets.</p>`,
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "The distinct triplets are [-1,0,1] and [-1,-1,2]."
      },
      {
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "The only possible triplet does not sum up to 0."
      },
      {
        input: "nums = [0,0,0]",
        output: "[[0,0,0]]",
        explanation: "The only possible triplet sums up to 0."
      }
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    testCases: [
      { input: { nums: [-1, 0, 1, 2, -1, -4] }, output: [[-1, -1, 2], [-1, 0, 1]] },
      { input: { nums: [0, 1, 1] }, output: [] },
      { input: { nums: [0, 0, 0] }, output: [[0, 0, 0]] },
      { input: { nums: [-2, 0, 1, 1, 2] }, output: [[-2, 0, 2], [-2, 1, 1]] }
    ],
    companies: ["Facebook", "Amazon", "Microsoft", "Apple"],
    tags: ["Array", "Two Pointers", "Sorting"],
    likes: 14567,
    dislikes: 1345,
    submissions: 2567890,
    acceptanceRate: 31.4
  },
  {
    id: 8,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: `<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>
    <p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>`,
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps"
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways to climb to the top: 1. 1 step + 1 step + 1 step, 2. 1 step + 2 steps, 3. 2 steps + 1 step"
      }
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    testCases: [
      { input: { n: 2 }, output: 2 },
      { input: { n: 3 }, output: 3 },
      { input: { n: 1 }, output: 1 },
      { input: { n: 4 }, output: 5 },
      { input: { n: 5 }, output: 8 }
    ],
    companies: ["Adobe", "Amazon", "Microsoft"],
    tags: ["Math", "Dynamic Programming", "Memoization"],
    likes: 9876,
    dislikes: 234,
    submissions: 1789123,
    acceptanceRate: 52.3
  },
  {
    id: 9,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    description: `<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>ith</code> day.</p>
    <p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>
    <p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>`,
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0."
      }
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, output: 5 },
      { input: { prices: [7, 6, 4, 3, 1] }, output: 0 },
      { input: { prices: [1, 2, 3, 4, 5] }, output: 4 },
      { input: { prices: [1] }, output: 0 },
      { input: { prices: [2, 1] }, output: 0 }
    ],
    companies: ["Amazon", "Facebook", "Microsoft", "Bloomberg"],
    tags: ["Array", "Dynamic Programming"],
    likes: 12345,
    dislikes: 567,
    submissions: 2345678,
    acceptanceRate: 54.7
  },
  {
    id: 10,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    description: `<p>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>`,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed."
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        explanation: "Two node list reversed."
      },
      {
        input: "head = []",
        output: "[]",
        explanation: "Empty list remains empty."
      }
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    testCases: [
      { input: { head: [1, 2, 3, 4, 5] }, output: [5, 4, 3, 2, 1] },
      { input: { head: [1, 2] }, output: [2, 1] },
      { input: { head: [] }, output: [] },
      { input: { head: [1] }, output: [1] }
    ],
    companies: ["Microsoft", "Amazon", "Apple", "Google"],
    tags: ["Linked List", "Recursion"],
    likes: 13456,
    dislikes: 234,
    submissions: 2456789,
    acceptanceRate: 71.2
  },
  {
    id: 11,
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    description: `<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> <em>if</em> <code>t</code> <em>is an anagram of</em> <code>s</code><em>, and</em> <code>false</code> <em>otherwise</em>.</p>
    <p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>`,
    examples: [
      {
        input: "s = \"anagram\", t = \"nagaram\"",
        output: "true",
        explanation: "Both strings contain the same characters with same frequency."
      },
      {
        input: "s = \"rat\", t = \"car\"",
        output: "false",
        explanation: "Different characters, not an anagram."
      }
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    testCases: [
      { input: { s: "anagram", t: "nagaram" }, output: true },
      { input: { s: "rat", t: "car" }, output: false },
      { input: { s: "a", t: "ab" }, output: false },
      { input: { s: "ab", t: "ba" }, output: true }
    ],
    companies: ["Amazon", "Microsoft", "Bloomberg", "Spotify"],
    tags: ["Hash Table", "String", "Sorting"],
    likes: 6789,
    dislikes: 234,
    submissions: 1567890,
    acceptanceRate: 63.2
  },
  {
    id: 12,
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description: `<p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.</p>
    <p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>`,
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4"
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, output: 4 },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, output: -1 },
      { input: { nums: [5], target: 5 }, output: 0 },
      { input: { nums: [5], target: -5 }, output: -1 }
    ],
    companies: ["Microsoft", "Amazon", "Google", "Facebook"],
    tags: ["Array", "Binary Search"],
    likes: 4567,
    dislikes: 123,
    submissions: 1234567,
    acceptanceRate: 58.9
  },
  {
    id: 13,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array",
    description: `<p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>
    <p>Find two lines that together with the x-axis form a container that can contain the most water.</p>
    <p>Return <em>the maximum amount of water a container can store</em>.</p>
    <p><strong>Notice</strong> that you may not slant the container.</p>`,
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49."
      },
      {
        input: "height = [1,1]",
        output: "1",
        explanation: "Two lines of height 1 at distance 1 apart."
      }
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    testCases: [
      { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, output: 49 },
      { input: { height: [1, 1] }, output: 1 },
      { input: { height: [4, 3, 2, 1, 4] }, output: 16 },
      { input: { height: [1, 2, 1] }, output: 2 }
    ],
    companies: ["Facebook", "Amazon", "Bloomberg", "Adobe"],
    tags: ["Array", "Two Pointers", "Greedy"],
    likes: 17890,
    dislikes: 998,
    submissions: 2890456,
    acceptanceRate: 54.3
  },
  {
    id: 14,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    category: "String",
    description: `<p>Write a function to find the longest common prefix string amongst an array of strings.</p>
    <p>If there is no common prefix, return an empty string <code>""</code>.</p>`,
    examples: [
      {
        input: "strs = [\"flower\",\"flow\",\"flight\"]",
        output: "\"fl\"",
        explanation: "The longest common prefix is \"fl\"."
      },
      {
        input: "strs = [\"dog\",\"racecar\",\"car\"]",
        output: "\"\"",
        explanation: "There is no common prefix among the input strings."
      }
    ],
    constraints: [
      "1 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
      "strs[i] consists of only lowercase English letters."
    ],
    testCases: [
      { input: { strs: ["flower", "flow", "flight"] }, output: "fl" },
      { input: { strs: ["dog", "racecar", "car"] }, output: "" },
      { input: { strs: ["interspecies", "interstellar", "interstate"] }, output: "inters" },
      { input: { strs: [""] }, output: "" },
      { input: { strs: ["a"] }, output: "a" }
    ],
    companies: ["Microsoft", "Amazon", "Google"],
    tags: ["String", "Trie"],
    likes: 6543,
    dislikes: 234,
    submissions: 1567890,
    acceptanceRate: 40.1
  },
  {
    id: 15,
    title: "Roman to Integer",
    difficulty: "Easy",
    category: "String",
    description: `<p>Roman numerals are represented by seven different symbols: <code>I</code>, <code>V</code>, <code>X</code>, <code>L</code>, <code>C</code>, <code>D</code> and <code>M</code>.</p>
    <table>
    <tr><th>Symbol</th><th>Value</th></tr>
    <tr><td>I</td><td>1</td></tr>
    <tr><td>V</td><td>5</td></tr>
    <tr><td>X</td><td>10</td></tr>
    <tr><td>L</td><td>50</td></tr>
    <tr><td>C</td><td>100</td></tr>
    <tr><td>D</td><td>500</td></tr>
    <tr><td>M</td><td>1000</td></tr>
    </table>
    <p>Given a roman numeral, convert it to an integer.</p>`,
    examples: [
      {
        input: "s = \"III\"",
        output: "3",
        explanation: "III = 3."
      },
      {
        input: "s = \"LVIII\"",
        output: "58",
        explanation: "L = 50, V= 5, III = 3."
      },
      {
        input: "s = \"MCMXC\"",
        output: "1994",
        explanation: "M = 1000, CM = 900, XC = 90."
      }
    ],
    constraints: [
      "1 <= s.length <= 15",
      "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').",
      "It is guaranteed that s is a valid roman numeral in the range [1, 3999]."
    ],
    testCases: [
      { input: { s: "III" }, output: 3 },
      { input: { s: "LVIII" }, output: 58 },
      { input: { s: "MCMXC" }, output: 1994 },
      { input: { s: "IV" }, output: 4 },
      { input: { s: "IX" }, output: 9 }
    ],
    companies: ["Amazon", "Microsoft", "Facebook", "Yahoo"],
    tags: ["Hash Table", "Math", "String"],
    likes: 5678,
    dislikes: 345,
    submissions: 1345678,
    acceptanceRate: 58.7
  },
  {
    id: 16,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    category: "Array",
    description: `<p>Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, remove the duplicates <strong>in-place</strong> such that each unique element appears only <strong>once</strong>. The <strong>relative order</strong> of the elements should be kept the <strong>same</strong>.</p>
    <p>Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the <strong>first part</strong> of the array <code>nums</code>. More formally, if there are <code>k</code> elements after removing the duplicates, then the first <code>k</code> elements of <code>nums</code> should hold the final result.</p>
    <p>Return <code>k</code> <em>after placing the final result in the first</em> <code>k</code> <em>slots of</em> <code>nums</code>.</p>`,
    examples: [
      {
        input: "nums = [1,1,2]",
        output: "2, nums = [1,2,_]",
        explanation: "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively."
      },
      {
        input: "nums = [0,0,1,1,1,2,2,3,3,4]",
        output: "5, nums = [0,1,2,3,4,_,_,_,_,_]",
        explanation: "Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively."
      }
    ],
    constraints: [
      "1 <= nums.length <= 3 * 10^4",
      "-100 <= nums[i] <= 100",
      "nums is sorted in non-decreasing order."
    ],
    testCases: [
      { input: { nums: [1, 1, 2] }, output: 2 },
      { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, output: 5 },
      { input: { nums: [1, 2, 3] }, output: 3 },
      { input: { nums: [1] }, output: 1 },
      { input: { nums: [1, 1, 1] }, output: 1 }
    ],
    companies: ["Microsoft", "Facebook", "Amazon"],
    tags: ["Array", "Two Pointers"],
    likes: 7890,
    dislikes: 12345,
    submissions: 2345678,
    acceptanceRate: 50.2
  },
  {
    id: 17,
    title: "Search Insert Position",
    difficulty: "Easy",
    category: "Binary Search",
    description: `<p>Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.</p>
    <p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>`,
    examples: [
      {
        input: "nums = [1,3,5,6], target = 5",
        output: "2",
        explanation: "Target 5 is found at index 2."
      },
      {
        input: "nums = [1,3,5,6], target = 2",
        output: "1",
        explanation: "Target 2 should be inserted at index 1."
      },
      {
        input: "nums = [1,3,5,6], target = 7",
        output: "4",
        explanation: "Target 7 should be inserted at index 4."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 <= nums[i] <= 10^4",
      "nums contains distinct values sorted in ascending order.",
      "-10^4 <= target <= 10^4"
    ],
    testCases: [
      { input: { nums: [1, 3, 5, 6], target: 5 }, output: 2 },
      { input: { nums: [1, 3, 5, 6], target: 2 }, output: 1 },
      { input: { nums: [1, 3, 5, 6], target: 7 }, output: 4 },
      { input: { nums: [1, 3, 5, 6], target: 0 }, output: 0 },
      { input: { nums: [1], target: 0 }, output: 0 }
    ],
    companies: ["Amazon", "Microsoft", "LinkedIn"],
    tags: ["Array", "Binary Search"],
    likes: 8901,
    dislikes: 456,
    submissions: 1890123,
    acceptanceRate: 45.6
  },
  {
    id: 18,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    description: `<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p>
    <p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>`,
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      },
      {
        input: "l1 = [0], l2 = [0]",
        output: "[0]",
        explanation: "0 + 0 = 0."
      },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
        explanation: "9999999 + 9999 = 10009998."
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    testCases: [
      { input: { l1: [2, 4, 3], l2: [5, 6, 4] }, output: [7, 0, 8] },
      { input: { l1: [0], l2: [0] }, output: [0] },
      { input: { l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9] }, output: [8, 9, 9, 9, 0, 0, 0, 1] },
      { input: { l1: [2, 4, 9], l2: [5, 6, 4, 9] }, output: [7, 0, 4, 0, 1] }
    ],
    companies: ["Amazon", "Microsoft", "Google", "Facebook"],
    tags: ["Linked List", "Math", "Recursion"],
    likes: 19876,
    dislikes: 3456,
    submissions: 3456789,
    acceptanceRate: 38.7
  },
  {
    id: 19,
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description: `<p>Given an integer <code>x</code>, return <code>true</code> <em>if</em> <code>x</code> <em>is a palindrome, and</em> <code>false</code> <em>otherwise</em>.</p>`,
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome."
      }
    ],
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ],
    testCases: [
      { input: { x: 121 }, output: true },
      { input: { x: -121 }, output: false },
      { input: { x: 10 }, output: false },
      { input: { x: 0 }, output: true },
      { input: { x: 1221 }, output: true }
    ],
    companies: ["Amazon", "Microsoft", "Adobe"],
    tags: ["Math"],
    likes: 6789,
    dislikes: 2345,
    submissions: 2789456,
    acceptanceRate: 52.1
  },
  {
    id: 20,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    description: `<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>
    <p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>`,
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    testCases: [
      { input: { nums1: [1, 3], nums2: [2] }, output: 2.0 },
      { input: { nums1: [1, 2], nums2: [3, 4] }, output: 2.5 },
      { input: { nums1: [0, 0], nums2: [0, 0] }, output: 0.0 },
      { input: { nums1: [], nums2: [1] }, output: 1.0 },
      { input: { nums1: [2], nums2: [] }, output: 2.0 }
    ],
    companies: ["Google", "Amazon", "Microsoft", "Apple"],
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    likes: 15678,
    dislikes: 1876,
    submissions: 1567890,
    acceptanceRate: 34.2
  }
];

async function seedProblems() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(MONGODB_DB);
    console.log(`✅ Connected to database: ${MONGODB_DB}`);

    // Add metadata to each problem
    const enrichedProblems = problems.map(problem => ({
      ...problem,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: Math.floor(Math.random() * 10000) + 1000, // Random views between 1000-11000
      isPremium: Math.random() < 0.2, // 20% chance of being premium
      hints: [], // Can be populated later
      editorials: [], // Can be populated later
      relatedTopics: [], // Can be populated later
      followUp: problem.difficulty === 'Easy' ? null : `Try to solve this problem with O(1) space complexity.`,
      codeTemplates: [
        {
          language: 'javascript',
          code: `/**
 * @param {${problem.category === 'Array' ? 'number[]' : 'any'}} input
 * @return {${problem.category === 'Array' ? 'number[]' : 'any'}}
 */
var solution = function(input) {
    // Your code here
    return null;
};`
        },
        {
          language: 'python',
          code: `class Solution:
    def solution(self, input):
        """
        ${problem.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
        """
        # Your code here
        pass`
        }
      ]
    }));

    console.log(`🌱 Seeding ${enrichedProblems.length} problems...`);

    // Insert problems in batches
    const batchSize = 5;
    for (let i = 0; i < enrichedProblems.length; i += batchSize) {
      const batch = enrichedProblems.slice(i, i + batchSize);
      await db.collection('problems-new').insertMany(batch);
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(enrichedProblems.length / batchSize)}`);
    }

    // Verify the insertion
    const totalCount = await db.collection('problems-new').countDocuments();
    console.log(`\n📊 Verification: ${totalCount} problems in database`);

    // Get some statistics
    const stats = await db.collection('problems-new').aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    console.log('\n📈 Problem Statistics:');
    stats.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count} problems`);
    });

    // Get category distribution
    const categories = await db.collection('problems-new').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray();

    console.log('\n🏷️  Category Distribution:');
    categories.forEach(cat => {
      console.log(`- ${cat._id}: ${cat.count} problems`);
    });

    console.log('\n🎉 Problem seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- ✅ ${enrichedProblems.length} problems inserted`);
    console.log('- ✅ Each problem includes comprehensive test cases');
    console.log('- ✅ Company tags and difficulty levels assigned');
    console.log('- ✅ Code templates for multiple languages');
    console.log('- ✅ Realistic stats and metadata');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 Database connection closed');
  }
}

// Run seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProblems()
    .then(() => {
      console.log('\n✨ Problem seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

export { seedProblems, problems };
