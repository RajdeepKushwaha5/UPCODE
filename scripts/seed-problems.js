import dbConnect from '../utils/dbConnect.js';
import { Problem } from '../models/Problem.js';

// Connect to database
await dbConnect();

// Array of high-quality coding problems
const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
<p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
<p>You can return the answer in any order.</p>`,
    difficulty: "Easy",
    categories: ["Array", "Hash Table"],
    companies: ["Google", "Amazon", "Facebook", "Apple", "Microsoft"],
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    starterCode: `function twoSum(nums, target) {
    // Your code here
};`,
    solutionCode: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]",
        isHidden: false
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]",
        isHidden: false
      },
      {
        input: "[3,3]\n6",
        expectedOutput: "[0,1]",
        isHidden: false
      },
      {
        input: "[1,2,3,4,5]\n9",
        expectedOutput: "[3,4]",
        isHidden: true
      },
      {
        input: "[-1,-2,-3,-4,-5]\n-8",
        expectedOutput: "[2,4]",
        isHidden: true
      }
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
    order: 1
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: `<p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
<p>An input string is valid if:</p>
<ul>
<li>Open brackets must be closed by the same type of brackets.</li>
<li>Open brackets must be closed in the correct order.</li>
<li>Every close bracket has a corresponding open bracket of the same type.</li>
</ul>`,
    difficulty: "Easy",
    categories: ["String", "Stack"],
    companies: ["Microsoft", "Google", "Amazon", "Facebook", "Bloomberg", "Apple"],
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    examples: [
      {
        input: "s = \"()\"",
        output: "true"
      },
      {
        input: "s = \"()[]{}\"",
        output: "true"
      },
      {
        input: "s = \"(]\"",
        output: "false"
      }
    ],
    starterCode: `function isValid(s) {
    // Your code here
};`,
    solutionCode: `function isValid(s) {
    const stack = [];
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.length === 0 || stack.pop() !== map[char]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
};`,
    testCases: [
      {
        input: "\"()\"",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "\"()[]{}\"",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "\"(]\"",
        expectedOutput: "false",
        isHidden: false
      },
      {
        input: "\"([)]\"",
        expectedOutput: "false",
        isHidden: true
      },
      {
        input: "\"{[]}\"",
        expectedOutput: "true",
        isHidden: true
      }
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=WTzjTskDFMg",
    order: 2
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    description: `<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.</p>
<p>Merge the two lists into one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists.</p>
<p>Return <em>the head of the merged linked list</em>.</p>`,
    difficulty: "Easy",
    categories: ["Linked List", "Recursion"],
    companies: ["Amazon", "Microsoft", "Adobe", "LinkedIn", "Google", "Apple"],
    constraints: "The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth list1 and list2 are sorted in non-decreasing order.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]"
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]"
      }
    ],
    starterCode: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function mergeTwoLists(list1, list2) {
    // Your code here
};`,
    solutionCode: `function mergeTwoLists(list1, list2) {
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }
    
    // Attach remaining nodes
    current.next = list1 || list2;
    
    return dummy.next;
};`,
    testCases: [
      {
        input: "[1,2,4]\n[1,3,4]",
        expectedOutput: "[1,1,2,3,4,4]",
        isHidden: false
      },
      {
        input: "[]\n[]",
        expectedOutput: "[]",
        isHidden: false
      },
      {
        input: "[]\n[0]",
        expectedOutput: "[0]",
        isHidden: false
      },
      {
        input: "[2]\n[1]",
        expectedOutput: "[1,2]",
        isHidden: true
      },
      {
        input: "[-1,0,1]\n[-1,2,3]",
        expectedOutput: "[-1,-1,0,1,2,3]",
        isHidden: true
      }
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=XIdigk956u0",
    order: 3
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    description: `<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>
<p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>
<p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>`,
    difficulty: "Easy",
    categories: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple", "Adobe", "Bloomberg"],
    constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
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
    starterCode: `function maxProfit(prices) {
    // Your code here
};`,
    solutionCode: `function maxProfit(prices) {
    let minPrice = prices[0];
    let maxProfit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
};`,
    testCases: [
      {
        input: "[7,1,5,3,6,4]",
        expectedOutput: "5",
        isHidden: false
      },
      {
        input: "[7,6,4,3,1]",
        expectedOutput: "0",
        isHidden: false
      },
      {
        input: "[1,2]",
        expectedOutput: "1",
        isHidden: false
      },
      {
        input: "[2,4,1]",
        expectedOutput: "2",
        isHidden: true
      },
      {
        input: "[3,2,6,5,0,3]",
        expectedOutput: "4",
        isHidden: true
      }
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=1pkOgXD63yU",
    order: 4
  },
  {
    title: "Linked List Cycle",
    slug: "linked-list-cycle",
    description: `<p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.</p>
<p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Internally, <code>pos</code> is used to denote the index of the node that tail's <code>next</code> pointer is connected to. <strong>Note that <code>pos</code> is not passed as a parameter</strong>.</p>
<p>Return <code>true</code><em> if there is a cycle in the linked list</em>. Otherwise, return <code>false</code>.</p>`,
    difficulty: "Easy",
    categories: ["Linked List", "Two Pointers"],
    companies: ["Amazon", "Microsoft", "Bloomberg", "Apple", "Google", "Facebook"],
    constraints: "The number of the nodes in the list is in the range [0, 10^4].\n-10^5 <= Node.val <= 10^5\npos is -1 or a valid index in the linked-list.",
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
      },
      {
        input: "head = [1,2], pos = 0",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 0th node."
      },
      {
        input: "head = [1], pos = -1",
        output: "false",
        explanation: "There is no cycle in the linked list."
      }
    ],
    starterCode: `// Definition for singly-linked list.
function ListNode(val) {
    this.val = val;
    this.next = null;
}

function hasCycle(head) {
    // Your code here
};`,
    solutionCode: `function hasCycle(head) {
    if (!head || !head.next) {
        return false;
    }
    
    let slow = head;
    let fast = head.next;
    
    while (slow !== fast) {
        if (!fast || !fast.next) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return true;
};`,
    testCases: [
      {
        input: "[3,2,0,-4]\n1",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "[1,2]\n0",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "[1]\n-1",
        expectedOutput: "false",
        isHidden: false
      },
      {
        input: "[]\n-1",
        expectedOutput: "false",
        isHidden: true
      },
      {
        input: "[1,1,1,1]\n-1",
        expectedOutput: "false",
        isHidden: true
      }
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=gBTe7lFR3vc",
    order: 5
  }
];

// Insert problems into database
for (const problem of problems) {
  try {
    // Check if problem already exists
    const existingProblem = await Problem.findOne({ slug: problem.slug });
    if (existingProblem) {
      console.log(`Problem ${problem.title} already exists, skipping...`);
      continue;
    }
    
    // Create new problem
    const newProblem = new Problem(problem);
    await newProblem.save();
    console.log(`Successfully seeded problem: ${problem.title}`);
  } catch (error) {
    console.error(`Error seeding problem ${problem.title}:`, error);
  }
}

console.log('Problems seeding completed!');
