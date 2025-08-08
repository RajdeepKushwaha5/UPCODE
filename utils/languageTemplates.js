/**
 * Language Templates for LeetCode-style Problems
 * Provides boilerplate code for each supported language
 */

export const LANGUAGE_TEMPLATES = {
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    judge0Id: 63,
    template: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
    
};

// Example usage:
// console.log(twoSum([2,7,11,15], 9)); // [0,1]`
  },
  
  python: {
    name: 'Python 3',
    extension: 'py',
    judge0Id: 71,
    template: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        # Write your solution here
        pass

# Example usage:
# solution = Solution()
# print(solution.twoSum([2,7,11,15], 9))  # [0,1]`
  },
  
  java: {
    name: 'Java',
    extension: 'java',
    judge0Id: 62,
    template: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[]{};
    }
}

// Example usage:
// Solution solution = new Solution();
// int[] result = solution.twoSum(new int[]{2,7,11,15}, 9);
// System.out.println(Arrays.toString(result)); // [0, 1]`
  },
  
  cpp: {
    name: 'C++',
    extension: 'cpp',
    judge0Id: 54,
    template: `#include <vector>
#include <iostream>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
        return {};
    }
};

// Example usage:
// int main() {
//     Solution solution;
//     vector<int> nums = {2, 7, 11, 15};
//     vector<int> result = solution.twoSum(nums, 9);
//     for (int i : result) {
//         cout << i << " ";
//     }
//     return 0;
// }`
  },
  
  c: {
    name: 'C',
    extension: 'c',
    judge0Id: 50,
    template: `#include <stdio.h>
#include <stdlib.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize){
    // Write your solution here
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    
    return result;
}

// Example usage:
// int main() {
//     int nums[] = {2, 7, 11, 15};
//     int returnSize;
//     int* result = twoSum(nums, 4, 9, &returnSize);
//     printf("[%d, %d]\\n", result[0], result[1]);
//     free(result);
//     return 0;
// }`
  },
  
  csharp: {
    name: 'C#',
    extension: 'cs',
    judge0Id: 51,
    template: `using System;

public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[]{};
    }
}

// Example usage:
// class Program {
//     static void Main() {
//         Solution solution = new Solution();
//         int[] result = solution.TwoSum(new int[]{2,7,11,15}, 9);
//         Console.WriteLine($"[{result[0]}, {result[1]}]");
//     }
// }`
  },
  
  go: {
    name: 'Go',
    extension: 'go',
    judge0Id: 60,
    template: `package main

import "fmt"

func twoSum(nums []int, target int) []int {
    // Write your solution here
    
    return []int{}
}

// Example usage:
// func main() {
//     result := twoSum([]int{2, 7, 11, 15}, 9)
//     fmt.Println(result) // [0 1]
// }`
  },
  
  rust: {
    name: 'Rust',
    extension: 'rs',
    judge0Id: 73,
    template: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Write your solution here
        
        vec![]
    }
}

// Example usage:
// fn main() {
//     let result = Solution::two_sum(vec![2, 7, 11, 15], 9);
//     println!("{:?}", result); // [0, 1]
// }`
  },
  
  kotlin: {
    name: 'Kotlin',
    extension: 'kt',
    judge0Id: 78,
    template: `class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        // Write your solution here
        
        return intArrayOf()
    }
}

// Example usage:
// fun main() {
//     val solution = Solution()
//     val result = solution.twoSum(intArrayOf(2, 7, 11, 15), 9)
//     println(result.contentToString()) // [0, 1]
// }`
  },
  
  swift: {
    name: 'Swift',
    extension: 'swift',
    judge0Id: 83,
    template: `class Solution {
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        // Write your solution here
        
        return []
    }
}

// Example usage:
// let solution = Solution()
// let result = solution.twoSum([2, 7, 11, 15], 9)
// print(result) // [0, 1]`
  },
  
  typescript: {
    name: 'TypeScript',
    extension: 'ts',
    judge0Id: 74,
    template: `function twoSum(nums: number[], target: number): number[] {
    // Write your solution here
    
    return [];
}

// Example usage:
// console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`
  },
  
  php: {
    name: 'PHP',
    extension: 'php',
    judge0Id: 68,
    template: `<?php

class Solution {

    /**
     * @param Integer[] $nums
     * @param Integer $target
     * @return Integer[]
     */
    function twoSum($nums, $target) {
        // Write your solution here
        
        return [];
    }
}

// Example usage:
// $solution = new Solution();
// $result = $solution->twoSum([2, 7, 11, 15], 9);
// print_r($result); // [0, 1]

?>`
  },
  
  ruby: {
    name: 'Ruby',
    extension: 'rb',
    judge0Id: 72,
    template: `# @param {Integer[]} nums
# @param {Integer} target
# @return {Integer[]}
def two_sum(nums, target)
    # Write your solution here
    
end

# Example usage:
# puts two_sum([2, 7, 11, 15], 9).inspect # [0, 1]`
  }
}

/**
 * Get template for a specific language
 */
export function getLanguageTemplate(language) {
  return LANGUAGE_TEMPLATES[language] || LANGUAGE_TEMPLATES.javascript;
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages() {
  return Object.keys(LANGUAGE_TEMPLATES);
}

/**
 * Generate problem-specific template based on function signature
 */
export function generateProblemTemplate(language, functionName, params = [], returnType = 'void') {
  const langConfig = LANGUAGE_TEMPLATES[language];
  if (!langConfig) return '';
  
  // This is a simplified version - you can extend this based on your needs
  switch (language) {
    case 'javascript':
      return `/**
 * ${params.map(p => `@param {${p.type}} ${p.name}`).join('\n * ')}
 * @return {${returnType}}
 */
var ${functionName} = function(${params.map(p => p.name).join(', ')}) {
    // Write your solution here
    
};`;
    
    case 'python':
      return `class Solution:
    def ${functionName}(self, ${params.map(p => `${p.name}: ${p.type}`).join(', ')}) -> ${returnType}:
        # Write your solution here
        pass`;
    
    case 'java':
      return `class Solution {
    public ${returnType} ${functionName}(${params.map(p => `${p.type} ${p.name}`).join(', ')}) {
        // Write your solution here
        
    }
}`;
    
    case 'cpp':
      return `class Solution {
public:
    ${returnType} ${functionName}(${params.map(p => `${p.type} ${p.name}`).join(', ')}) {
        // Write your solution here
        
    }
};`;
    
    default:
      return langConfig.template;
  }
}
