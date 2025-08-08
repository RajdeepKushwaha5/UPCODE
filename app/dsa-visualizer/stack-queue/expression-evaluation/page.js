'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaStepForward,
  FaStepBackward,
  FaArrowLeft,
  FaCogs,
  FaCalculator,
  FaLayerGroup,
  FaPlus
} from 'react-icons/fa'

const ExpressionEvaluation = () => {
  const router = useRouter()
  const [expression, setExpression] = useState('3 + 4 * 2 - 1')
  const [evaluationType, setEvaluationType] = useState('infix')
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [stack, setStack] = useState([])
  const [outputQueue, setOutputQueue] = useState([])
  const [currentToken, setCurrentToken] = useState('')
  const [result, setResult] = useState(null)
  const [operatorStack, setOperatorStack] = useState([])
  const [manualExpression, setManualExpression] = useState('')

  // Operator precedence and associativity
  const precedence = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '^': 3,
    '(': 0, ')': 0
  }

  const isRightAssociative = (op) => op === '^'

  // Check if character is operator
  const isOperator = (char) => '+-*/^'.includes(char)

  // Check if character is operand
  const isOperand = (char) => /^[0-9]$/.test(char)

  // Tokenize expression
  const tokenize = (expr) => {
    return expr.replace(/\s+/g, '').split('').filter(char => char !== '')
  }

  // Convert infix to postfix (Shunting Yard Algorithm)
  const infixToPostfix = (tokens, steps = []) => {
    const outputQueue = []
    const operatorStack = []
    
    steps.push({
      type: 'start',
      currentToken: '',
      stack: [...operatorStack],
      outputQueue: [...outputQueue],
      expression: tokens.join(' '),
      result: null,
      description: 'Starting infix to postfix conversion using Shunting Yard algorithm'
    })

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      
      steps.push({
        type: 'read_token',
        currentToken: token,
        stack: [...operatorStack],
        outputQueue: [...outputQueue],
        expression: tokens.join(' '),
        result: null,
        description: `Reading token: ${token}`
      })

      if (isOperand(token)) {
        outputQueue.push(token)
        
        steps.push({
          type: 'push_operand',
          currentToken: token,
          stack: [...operatorStack],
          outputQueue: [...outputQueue],
          expression: tokens.join(' '),
          result: null,
          description: `Operand ${token} added to output queue`
        })
      } else if (token === '(') {
        operatorStack.push(token)
        
        steps.push({
          type: 'push_left_paren',
          currentToken: token,
          stack: [...operatorStack],
          outputQueue: [...outputQueue],
          expression: tokens.join(' '),
          result: null,
          description: `Left parenthesis ${token} pushed to operator stack`
        })
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          const op = operatorStack.pop()
          outputQueue.push(op)
          
          steps.push({
            type: 'pop_to_paren',
            currentToken: op,
            stack: [...operatorStack],
            outputQueue: [...outputQueue],
            expression: tokens.join(' '),
            result: null,
            description: `Operator ${op} popped from stack to output until left parenthesis`
          })
        }
        
        if (operatorStack.length > 0) {
          operatorStack.pop() // Remove the '('
        }
        
        steps.push({
          type: 'remove_left_paren',
          currentToken: token,
          stack: [...operatorStack],
          outputQueue: [...outputQueue],
          expression: tokens.join(' '),
          result: null,
          description: `Right parenthesis ${token} processed, left parenthesis removed from stack`
        })
      } else if (isOperator(token)) {
        while (operatorStack.length > 0 &&
               isOperator(operatorStack[operatorStack.length - 1]) &&
               ((precedence[operatorStack[operatorStack.length - 1]] > precedence[token]) ||
                (precedence[operatorStack[operatorStack.length - 1]] === precedence[token] && !isRightAssociative(token)))) {
          
          const op = operatorStack.pop()
          outputQueue.push(op)
          
          steps.push({
            type: 'pop_higher_precedence',
            currentToken: op,
            stack: [...operatorStack],
            outputQueue: [...outputQueue],
            expression: tokens.join(' '),
            result: null,
            description: `Operator ${op} has higher precedence than ${token}, popped to output`
          })
        }
        
        operatorStack.push(token)
        
        steps.push({
          type: 'push_operator',
          currentToken: token,
          stack: [...operatorStack],
          outputQueue: [...outputQueue],
          expression: tokens.join(' '),
          result: null,
          description: `Operator ${token} pushed to operator stack`
        })
      }
    }

    // Pop remaining operators
    while (operatorStack.length > 0) {
      const op = operatorStack.pop()
      outputQueue.push(op)
      
      steps.push({
        type: 'pop_remaining',
        currentToken: op,
        stack: [...operatorStack],
        outputQueue: [...outputQueue],
        expression: tokens.join(' '),
        result: null,
        description: `Remaining operator ${op} popped from stack to output`
      })
    }

    steps.push({
      type: 'conversion_complete',
      currentToken: '',
      stack: [...operatorStack],
      outputQueue: [...outputQueue],
      expression: tokens.join(' '),
      result: outputQueue.join(' '),
      description: `Infix to postfix conversion complete. Postfix: ${outputQueue.join(' ')}`
    })

    return { postfix: outputQueue, steps }
  }

  // Evaluate postfix expression
  const evaluatePostfix = (tokens, steps = []) => {
    const stack = []
    
    steps.push({
      type: 'start_evaluation',
      currentToken: '',
      stack: [...stack],
      outputQueue: tokens,
      expression: tokens.join(' '),
      result: null,
      description: 'Starting postfix evaluation'
    })

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      
      steps.push({
        type: 'read_token',
        currentToken: token,
        stack: [...stack],
        outputQueue: tokens,
        expression: tokens.join(' '),
        result: null,
        description: `Reading token: ${token}`
      })

      if (isOperand(token)) {
        stack.push(parseFloat(token))
        
        steps.push({
          type: 'push_operand',
          currentToken: token,
          stack: [...stack],
          outputQueue: tokens,
          expression: tokens.join(' '),
          result: null,
          description: `Operand ${token} pushed to stack`
        })
      } else if (isOperator(token)) {
        if (stack.length < 2) {
          steps.push({
            type: 'error',
            currentToken: token,
            stack: [...stack],
            outputQueue: tokens,
            expression: tokens.join(' '),
            result: null,
            description: `Error: Insufficient operands for operator ${token}`
          })
          return { result: null, steps }
        }

        const b = stack.pop()
        const a = stack.pop()
        
        steps.push({
          type: 'pop_operands',
          currentToken: token,
          stack: [...stack],
          outputQueue: tokens,
          expression: tokens.join(' '),
          result: null,
          description: `Popped operands: ${a} and ${b} for operator ${token}`
        })

        let result
        switch (token) {
          case '+': result = a + b; break
          case '-': result = a - b; break
          case '*': result = a * b; break
          case '/': result = b !== 0 ? a / b : NaN; break
          case '^': result = Math.pow(a, b); break
          default: result = NaN
        }

        stack.push(result)
        
        steps.push({
          type: 'push_result',
          currentToken: token,
          stack: [...stack],
          outputQueue: tokens,
          expression: tokens.join(' '),
          result: result,
          description: `Calculated ${a} ${token} ${b} = ${result}, pushed result to stack`
        })
      }
    }

    const finalResult = stack.length === 1 ? stack[0] : null
    
    steps.push({
      type: 'evaluation_complete',
      currentToken: '',
      stack: [...stack],
      outputQueue: tokens,
      expression: tokens.join(' '),
      result: finalResult,
      description: `Evaluation complete. Final result: ${finalResult}`
    })

    return { result: finalResult, steps }
  }

  // Evaluate infix expression directly
  const evaluateInfix = (expr) => {
    const tokens = tokenize(expr)
    const { postfix, steps: conversionSteps } = infixToPostfix(tokens)
    const { result, steps: evaluationSteps } = evaluatePostfix(postfix)
    
    return {
      result,
      steps: [...conversionSteps, ...evaluationSteps]
    }
  }

  // Generate evaluation steps
  const generateEvaluationSteps = useCallback(() => {
    const tokens = tokenize(expression)
    let evaluationResult

    switch (evaluationType) {
      case 'infix':
        evaluationResult = evaluateInfix(expression)
        break
      case 'postfix':
        evaluationResult = evaluatePostfix(tokens)
        break
      case 'conversion':
        evaluationResult = infixToPostfix(tokens)
        break
      default:
        evaluationResult = { result: null, steps: [] }
    }

    setSteps(evaluationResult.steps || [])
    setResult(evaluationResult.result)
    setCurrentStep(0)
  }, [expression, evaluationType])

  // Execute manual expression
  const executeManualExpression = () => {
    if (!manualExpression.trim()) return
    
    setExpression(manualExpression)
    setManualExpression('')
    
    setTimeout(() => {
      generateEvaluationSteps()
    }, 100)
  }

  // Initialize
  useEffect(() => {
    generateEvaluationSteps()
  }, [generateEvaluationSteps])

  // Play animation
  useEffect(() => {
    let interval
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1
          if (nextStep >= steps.length - 1) {
            setIsPlaying(false)
          }
          return nextStep
        })
      }, 2000 - speed)
    } else {
      setIsPlaying(false)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, speed])

  // Update visualization state
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setCurrentToken(step.currentToken || '')
      setStack(step.stack || [])
      setOutputQueue(step.outputQueue || [])
      setOperatorStack(step.operatorStack || [])
    }
  }, [currentStep, steps])

  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)
  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Render stack visualization
  const renderStack = (stackData, title) => {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-medium mb-3">{title}</h3>
        <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 min-h-[200px]">
          {stackData.length === 0 ? (
            <div className="text-gray-400 text-sm">Empty</div>
          ) : (
            stackData.map((item, index) => (
              <div
                key={index}
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-center min-w-[60px] ${
                  index === stackData.length - 1 ? 'ring-2 ring-yellow-400 animate-pulse' : ''
                }`}
              >
                {item}
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-2 text-gray-400 text-sm">
          Top {stackData.length > 0 && '→'} {stackData[stackData.length - 1] || ''}
        </div>
      </div>
    )
  }

  // Render queue visualization
  const renderQueue = (queueData, title) => {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-medium mb-3">{title}</h3>
        <div className="flex flex-wrap items-center justify-center space-x-2 min-h-[100px]">
          {queueData.length === 0 ? (
            <div className="text-gray-400 text-sm">Empty</div>
          ) : (
            queueData.map((item, index) => (
              <div
                key={index}
                className="bg-green-600 text-white px-3 py-2 rounded-lg font-bold"
              >
                {item}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // Render expression with current token highlighted
  const renderExpression = () => {
    const tokens = tokenize(expression)
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-medium mb-3">Current Expression</h3>
        <div className="flex flex-wrap items-center justify-center space-x-2">
          {tokens.map((token, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-lg font-bold ${
                token === currentToken
                  ? 'bg-yellow-500 text-black animate-pulse'
                  : 'bg-gray-600 text-white'
              }`}
            >
              {token}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dsa-visualizer')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Expression Evaluation
                </h1>
                <p className="text-gray-400 text-sm">Stack-based infix, postfix evaluation and conversion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalculator className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300 text-sm">Mathematical Parser</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaCogs className="w-5 h-5" />
                Expression Controls
              </h2>
              
              {/* Evaluation Type */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Evaluation Type
                </label>
                <select
                  value={evaluationType}
                  onChange={(e) => setEvaluationType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="infix">Infix Evaluation</option>
                  <option value="postfix">Postfix Evaluation</option>
                  <option value="conversion">Infix to Postfix</option>
                </select>
              </div>

              {/* Predefined Expressions */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Sample Expressions
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setExpression('3 + 4 * 2')}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                  >
                    3 + 4 * 2
                  </button>
                  <button
                    onClick={() => setExpression('( 3 + 4 ) * 2')}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                  >
                    ( 3 + 4 ) * 2
                  </button>
                  <button
                    onClick={() => setExpression('2 ^ 3 + 1')}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                  >
                    2 ^ 3 + 1
                  </button>
                </div>
              </div>

              {/* Manual Expression */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Custom Expression
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={manualExpression}
                    onChange={(e) => setManualExpression(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 2 + 3 * 4"
                  />
                  <button
                    onClick={executeManualExpression}
                    className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                    Evaluate Expression
                  </button>
                </div>
              </div>
              
              {/* Current Expression Display */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Current Expression
                </label>
                <div className="bg-gray-700 rounded-lg p-3 text-white font-mono text-center">
                  {expression}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pause : play}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={reset}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaRedo className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={prevStep}
                    disabled={currentStep <= 0}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaStepBackward className="w-4 h-4" />
                    Prev
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStep >= steps.length - 1}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaStepForward className="w-4 h-4" />
                    Next
                  </button>
                </div>

                <button
                  onClick={generateEvaluationSteps}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Restart Evaluation
                </button>
              </div>

              {/* Settings */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Animation Speed
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1900"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>

              {/* Result */}
              {result !== null && (
                <div className="mt-6 bg-green-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Result:</h3>
                  <div className="text-center bg-green-800 rounded p-3">
                    <span className="text-green-200 text-2xl font-bold">
                      {result}
                    </span>
                  </div>
                </div>
              )}

              {/* Operator Precedence */}
              <div className="mt-6 bg-orange-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Precedence:</h3>
                <div className="text-sm text-orange-200 space-y-1">
                  <p>^ (Power): 3 (Right Associative)</p>
                  <p>*, /: 2 (Left Associative)</p>
                  <p>+, -: 1 (Left Associative)</p>
                  <p>(): Highest Priority</p>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Legend</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500"></div>
                    <span className="text-gray-300">Current Token</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600"></div>
                    <span className="text-gray-300">Stack Elements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600"></div>
                    <span className="text-gray-300">Output Queue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FaLayerGroup className="w-5 h-5" />
                  Expression Evaluation Visualization
                </h2>
                <div className="text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              {/* Expression Display */}
              <div className="mb-6">
                {renderExpression()}
              </div>

              {/* Stack and Queue Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {evaluationType === 'conversion' || evaluationType === 'infix' ? (
                  <>
                    {renderStack(stack, 'Operator Stack')}
                    {renderQueue(outputQueue, 'Output Queue')}
                  </>
                ) : (
                  <>
                    {renderStack(stack, 'Evaluation Stack')}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-3">Postfix Expression</h3>
                      <div className="bg-gray-700 rounded-lg p-3 text-white font-mono text-center">
                        {expression}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Algorithm Steps */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Algorithm Steps:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-blue-800 rounded p-3">
                    <div className="text-blue-400 font-medium">1. Parse Tokens</div>
                    <div className="text-gray-300">Read expression character by character</div>
                  </div>
                  <div className="bg-green-800 rounded p-3">
                    <div className="text-green-400 font-medium">2. Apply Rules</div>
                    <div className="text-gray-300">Process based on operator precedence</div>
                  </div>
                  <div className="bg-purple-800 rounded p-3">
                    <div className="text-purple-400 font-medium">3. Evaluate</div>
                    <div className="text-gray-300">Compute final result using stack</div>
                  </div>
                </div>
              </div>

              {/* Current Step Description */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-2">Current Step:</h3>
                <p className="text-gray-300">
                  {steps[currentStep]?.description || 'Select an evaluation type and expression to begin'}
                </p>
              </div>

              {/* Algorithm Analysis */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Expression Evaluation Analysis</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Shunting Yard Algorithm:</strong> O(n) - converts infix to postfix</p>
                  <p><strong>Postfix Evaluation:</strong> O(n) - single pass through tokens</p>
                  <p><strong>Space Complexity:</strong> O(n) - stack and output queue storage</p>
                  <p><strong>Applications:</strong> Calculators, compilers, formula evaluation</p>
                  <p><strong>Advantage:</strong> Eliminates parentheses, simplifies evaluation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpressionEvaluation
