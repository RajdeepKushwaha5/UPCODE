// Advanced Problem Difficulty Algorithm
// This calculates dynamic difficulty based on user performance, problem characteristics, and community metrics

export class ProblemDifficultyAnalyzer {
  constructor() {
    // Base difficulty weights
    this.weights = {
      conceptComplexity: 0.25,      // How complex the core concepts are
      implementationDifficulty: 0.20, // How hard it is to implement
      communityMetrics: 0.20,       // Success rate, time to solve, etc.
      algorithmicComplexity: 0.15,  // Time/space complexity requirements
      edgeCasesComplexity: 0.10,    // Number and complexity of edge cases
      mathComplexity: 0.10          // Mathematical concepts required
    }

    // Concept difficulty mapping
    this.conceptDifficulty = {
      'array': 1, 'string': 1, 'math': 1,
      'hash-table': 2, 'two-pointers': 2, 'sorting': 2,
      'binary-search': 3, 'divide-and-conquer': 3, 'backtracking': 3,
      'dynamic-programming': 4, 'greedy': 3, 'graph': 4,
      'tree': 3, 'linked-list': 2, 'stack': 2, 'queue': 2,
      'heap': 4, 'trie': 4, 'union-find': 4,
      'sliding-window': 3, 'prefix-sum': 2,
      'topological-sort': 5, 'minimum-spanning-tree': 5,
      'shortest-path': 4, 'binary-indexed-tree': 5,
      'segment-tree': 5, 'suffix-array': 5
    }

    // Time complexity difficulty mapping
    this.complexityDifficulty = {
      'O(1)': 1, 'O(log n)': 2, 'O(n)': 2,
      'O(n log n)': 3, 'O(n²)': 3, 'O(n³)': 4,
      'O(2^n)': 5, 'O(n!)': 5
    }
  }

  /**
   * Calculate dynamic difficulty score for a problem
   * @param {Object} problem - Problem object with metadata
   * @param {Object} communityStats - Community performance statistics
   * @param {Object} userContext - User's skill level and history
   * @returns {Object} Difficulty analysis with score and breakdown
   */
  analyzeProblemDifficulty(problem, communityStats = {}, userContext = {}) {
    const analysis = {
      overallScore: 0,
      staticDifficulty: this.calculateStaticDifficulty(problem),
      dynamicDifficulty: this.calculateDynamicDifficulty(problem, communityStats),
      personalizedDifficulty: this.calculatePersonalizedDifficulty(problem, userContext),
      breakdown: {},
      recommendation: '',
      estimatedSolveTime: 0,
      category: ''
    }

    // Calculate weighted overall score
    analysis.overallScore = (
      analysis.staticDifficulty * 0.4 +
      analysis.dynamicDifficulty * 0.4 +
      analysis.personalizedDifficulty * 0.2
    )

    analysis.breakdown = this.getDetailedBreakdown(problem, communityStats, userContext)
    analysis.recommendation = this.generateRecommendation(analysis, userContext)
    analysis.estimatedSolveTime = this.estimateSolveTime(analysis, userContext)
    analysis.category = this.categorizeDifficulty(analysis.overallScore)

    return analysis
  }

  calculateStaticDifficulty(problem) {
    let score = 0

    // Concept complexity
    const concepts = problem.tags || []
    const conceptScore = concepts.reduce((sum, concept) => {
      return sum + (this.conceptDifficulty[concept.toLowerCase()] || 2)
    }, 0) / Math.max(concepts.length, 1)

    // Implementation difficulty based on code patterns
    const implementationScore = this.analyzeImplementationComplexity(problem)

    // Algorithmic complexity
    const complexityScore = this.analyzeAlgorithmicComplexity(problem)

    // Edge cases complexity
    const edgeCaseScore = this.analyzeEdgeCases(problem)

    // Mathematical complexity
    const mathScore = this.analyzeMathematicalComplexity(problem)

    score = (
      conceptScore * this.weights.conceptComplexity +
      implementationScore * this.weights.implementationDifficulty +
      complexityScore * this.weights.algorithmicComplexity +
      edgeCaseScore * this.weights.edgeCasesComplexity +
      mathScore * this.weights.mathComplexity
    )

    return Math.min(Math.max(score, 1), 5) // Clamp between 1-5
  }

  calculateDynamicDifficulty(problem, communityStats) {
    if (!communityStats || Object.keys(communityStats).length === 0) {
      return 2.5 // Default middle difficulty
    }

    let score = 2.5

    // Success rate impact
    if (communityStats.successRate !== undefined) {
      // Lower success rate = higher difficulty
      score += (1 - communityStats.successRate) * 2
    }

    // Average solve time impact
    if (communityStats.averageSolveTime !== undefined) {
      // Longer solve time = higher difficulty
      const timeScore = Math.min(communityStats.averageSolveTime / 30, 2) // Cap at 2 points
      score += timeScore
    }

    // Number of attempts impact
    if (communityStats.averageAttempts !== undefined) {
      // More attempts = higher difficulty
      const attemptScore = Math.min((communityStats.averageAttempts - 1) * 0.5, 1.5)
      score += attemptScore
    }

    // Rating distribution impact
    if (communityStats.ratingDistribution) {
      const avgRating = this.calculateWeightedAverageRating(communityStats.ratingDistribution)
      score += (5 - avgRating) * 0.3 // Higher score for lower ratings
    }

    return Math.min(Math.max(score, 1), 5)
  }

  calculatePersonalizedDifficulty(problem, userContext) {
    if (!userContext || Object.keys(userContext).length === 0) {
      return 2.5 // Default
    }

    let score = 2.5

    // User's skill level in relevant topics
    const concepts = problem.tags || []
    const userSkillScore = this.calculateUserSkillScore(concepts, userContext)
    score -= (userSkillScore - 2.5) * 0.5 // Adjust based on skill

    // User's historical performance on similar problems
    if (userContext.similarProblemsPerformance) {
      const perfScore = userContext.similarProblemsPerformance.averageScore || 2.5
      score -= (perfScore - 2.5) * 0.3
    }

    // User's current streak and momentum
    if (userContext.currentStreak > 5) {
      score -= 0.3 // Reduce difficulty for users on a streak
    } else if (userContext.recentFailures > 3) {
      score += 0.3 // Increase difficulty awareness for struggling users
    }

    return Math.min(Math.max(score, 1), 5)
  }

  analyzeImplementationComplexity(problem) {
    let score = 2

    const description = (problem.description || '').toLowerCase()
    const constraints = (problem.constraints || '').toLowerCase()

    // Check for complex implementation indicators
    if (description.includes('implement') && description.includes('data structure')) {
      score += 1.5
    }
    if (description.includes('simulate') || description.includes('design')) {
      score += 1
    }
    if (constraints.includes('10^9') || constraints.includes('10^18')) {
      score += 0.5 // Large constraints require efficient implementation
    }
    if (problem.examples && problem.examples.length > 3) {
      score += 0.3 // Many examples often indicate complex logic
    }

    return Math.min(score, 5)
  }

  analyzeAlgorithmicComplexity(problem) {
    let score = 2

    // Estimate required time complexity from constraints
    const constraints = problem.constraints || ''
    const numbers = constraints.match(/\d+/g) || []
    const maxN = Math.max(...numbers.map(n => parseInt(n)))

    if (maxN > 10**8) score += 2      // Requires O(log n) or O(1)
    else if (maxN > 10**6) score += 1.5 // Requires O(n) or better
    else if (maxN > 10**4) score += 1   // Allows O(n log n)
    else if (maxN > 10**3) score += 0.5 // Allows O(n²)

    // Check for DP/recursion indicators
    const description = (problem.description || '').toLowerCase()
    if (description.includes('optimal') || description.includes('maximum') || 
        description.includes('minimum') || description.includes('count ways')) {
      score += 0.5
    }

    return Math.min(score, 5)
  }

  analyzeEdgeCases(problem) {
    let score = 1

    const constraints = (problem.constraints || '').toLowerCase()
    const description = (problem.description || '').toLowerCase()

    // Check for edge case indicators
    if (constraints.includes('0 ≤') || constraints.includes('0 <=')) {
      score += 0.5 // Zero values
    }
    if (constraints.includes('empty') || description.includes('empty')) {
      score += 0.5 // Empty inputs
    }
    if (description.includes('duplicate') || description.includes('unique')) {
      score += 0.3 // Duplicate handling
    }
    if (description.includes('negative') || constraints.includes('-')) {
      score += 0.3 // Negative numbers
    }
    if (description.includes('overflow') || constraints.includes('10^18')) {
      score += 0.7 // Overflow concerns
    }

    return Math.min(score, 5)
  }

  analyzeMathematicalComplexity(problem) {
    let score = 1

    const description = (problem.description || '').toLowerCase()
    const tags = (problem.tags || []).map(t => t.toLowerCase())

    // Check for mathematical concepts
    if (tags.includes('math')) score += 1
    if (tags.includes('number-theory')) score += 1.5
    if (tags.includes('geometry')) score += 1.2
    if (tags.includes('probability')) score += 1.3
    if (tags.includes('combinatorics')) score += 1.4

    // Check description for math keywords
    const mathKeywords = ['prime', 'gcd', 'lcm', 'modulo', 'fibonacci', 'factorial', 
                         'permutation', 'combination', 'probability', 'geometry']
    mathKeywords.forEach(keyword => {
      if (description.includes(keyword)) score += 0.3
    })

    return Math.min(score, 5)
  }

  calculateUserSkillScore(concepts, userContext) {
    if (!userContext.topicSkills) return 2.5

    const relevantSkills = concepts.map(concept => 
      userContext.topicSkills[concept.toLowerCase()] || 2.5
    )

    return relevantSkills.length > 0 
      ? relevantSkills.reduce((sum, skill) => sum + skill, 0) / relevantSkills.length
      : 2.5
  }

  calculateWeightedAverageRating(ratingDistribution) {
    let totalWeightedScore = 0
    let totalVotes = 0

    Object.entries(ratingDistribution).forEach(([rating, votes]) => {
      totalWeightedScore += parseInt(rating) * votes
      totalVotes += votes
    })

    return totalVotes > 0 ? totalWeightedScore / totalVotes : 2.5
  }

  getDetailedBreakdown(problem, communityStats, userContext) {
    return {
      conceptComplexity: this.analyzeConceptComplexity(problem),
      implementationDifficulty: this.analyzeImplementationComplexity(problem),
      algorithmicComplexity: this.analyzeAlgorithmicComplexity(problem),
      edgeCasesComplexity: this.analyzeEdgeCases(problem),
      mathComplexity: this.analyzeMathematicalComplexity(problem),
      communitySuccessRate: communityStats.successRate || 0.5,
      personalizedAdjustment: userContext.skillLevel || 2.5
    }
  }

  analyzeConceptComplexity(problem) {
    const concepts = problem.tags || []
    return concepts.reduce((sum, concept) => {
      return sum + (this.conceptDifficulty[concept.toLowerCase()] || 2)
    }, 0) / Math.max(concepts.length, 1)
  }

  generateRecommendation(analysis, userContext) {
    const score = analysis.overallScore
    const userLevel = userContext.skillLevel || 2.5

    if (score < userLevel - 1) {
      return "This problem might be too easy for you. Consider it for a quick warm-up or review."
    } else if (score > userLevel + 1.5) {
      return "This problem is quite challenging for your current level. Great for learning but might be frustrating."
    } else if (score > userLevel + 0.5) {
      return "Perfect challenge level! This problem will help you grow your skills."
    } else {
      return "Good practice problem at your current skill level."
    }
  }

  estimateSolveTime(analysis, userContext) {
    const baseTime = analysis.overallScore * 15 // Base: 15 minutes per difficulty point
    const skillAdjustment = (userContext.skillLevel || 2.5) / analysis.overallScore
    
    return Math.round(baseTime / skillAdjustment)
  }

  categorizeDifficulty(score) {
    if (score <= 1.5) return 'Trivial'
    if (score <= 2.0) return 'Easy'
    if (score <= 2.5) return 'Easy-Medium'
    if (score <= 3.0) return 'Medium'
    if (score <= 3.5) return 'Medium-Hard'
    if (score <= 4.0) return 'Hard'
    if (score <= 4.5) return 'Very Hard'
    return 'Expert'
  }

  // Get difficulty progression recommendations
  getProgressionPath(userContext) {
    const currentLevel = userContext.skillLevel || 1
    const recommendations = []

    // Recommend problems slightly above current level
    for (let i = 0; i < 5; i++) {
      const targetDifficulty = currentLevel + (i * 0.3)
      recommendations.push({
        targetDifficulty: Math.min(targetDifficulty, 5),
        description: this.getProgressionDescription(targetDifficulty),
        focusAreas: this.getFocusAreas(targetDifficulty)
      })
    }

    return recommendations
  }

  getProgressionDescription(difficulty) {
    if (difficulty <= 2) return "Focus on basic algorithms and data structures"
    if (difficulty <= 3) return "Practice medium problems with multiple approaches"
    if (difficulty <= 4) return "Tackle complex algorithms and optimization"
    return "Master advanced techniques and contest-level problems"
  }

  getFocusAreas(difficulty) {
    if (difficulty <= 2) return ['arrays', 'strings', 'basic-math', 'two-pointers']
    if (difficulty <= 3) return ['binary-search', 'trees', 'graphs', 'dynamic-programming']
    if (difficulty <= 4) return ['advanced-dp', 'graph-algorithms', 'greedy', 'heap']
    return ['advanced-data-structures', 'mathematical-algorithms', 'optimization']
  }
}

export const difficultyAnalyzer = new ProblemDifficultyAnalyzer()
