'use client';
import { useState, useRef } from 'react';

class FibonacciSolver {
  constructor() {
    this.memo = new Map();
    this.callStack = [];
    this.computationTree = new Map();
  }

  clearMemo() {
    this.memo.clear();
    this.callStack = [];
    this.computationTree.clear();
  }

  async fibonacciDP(n, callback) {
    // Bottom-up DP approach
    const dp = [0, 1];
    
    await callback('initialized', { n, dp: [...dp] }, null);

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      
      await callback('computed', 
        { n: i, value: dp[i], prev1: dp[i - 1], prev2: dp[i - 2] },
        { dp: [...dp] }
      );
    }

    await callback('completed', { n, result: n < 2 ? dp[n] : dp[n] }, { dp: [...dp] });
    
    return n < 2 ? dp[n] : dp[n];
  }

  async fibonacciMemo(n, callback, depth = 0) {
    // Top-down memoization approach
    this.callStack.push({ n, depth });
    
    await callback('call', 
      { n, depth, memo: new Map(this.memo), callStack: [...this.callStack] },
      null
    );

    if (this.memo.has(n)) {
      const result = this.memo.get(n);
      this.callStack.pop();
      
      await callback('memo_hit', 
        { n, result, depth, memo: new Map(this.memo), callStack: [...this.callStack] },
        null
      );
      
      return result;
    }

    if (n < 2) {
      this.memo.set(n, n);
      this.callStack.pop();
      
      await callback('base_case', 
        { n, result: n, depth, memo: new Map(this.memo), callStack: [...this.callStack] },
        null
      );
      
      return n;
    }

    const fib1 = await this.fibonacciMemo(n - 1, callback, depth + 1);
    const fib2 = await this.fibonacciMemo(n - 2, callback, depth + 1);
    
    const result = fib1 + fib2;
    this.memo.set(n, result);
    this.callStack.pop();

    await callback('computed', 
      { n, result, fib1, fib2, depth, memo: new Map(this.memo), callStack: [...this.callStack] },
      null
    );

    return result;
  }
}

export default function FibonacciVisualization() {
  const [solver] = useState(new FibonacciSolver());
  const [n, setN] = useState(10);
  const [algorithm, setAlgorithm] = useState('dp'); // 'dp' or 'memo'
  const [animating, setAnimating] = useState(false);
  const [dpArray, setDpArray] = useState([]);
  const [memoMap, setMemoMap] = useState(new Map());
  const [callStack, setCallStack] = useState([]);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);

  const startFibonacci = async () => {
    if (animating || n < 0 || n > 20) return;

    setAnimating(true);
    setAlgorithmComplete(false);
    setCurrentOperation(null);
    setResult(null);
    setDpArray([]);
    setMemoMap(new Map());
    setCallStack([]);
    
    solver.clearMemo();
    
    const startTime = performance.now();

    const animationCallback = async (type, operation, state) => {
      setCurrentOperation({ type, operation, state });
      
      if (algorithm === 'dp' && state) {
        setDpArray(state.dp);
      } else if (algorithm === 'memo') {
        setMemoMap(operation.memo);
        setCallStack(operation.callStack);
      }
      
      if (type === 'completed') {
        const endTime = performance.now();
        setExecutionTime(endTime - startTime);
        setResult(operation.result);
        setAlgorithmComplete(true);
      }
      
      await new Promise(resolve => setTimeout(resolve, type === 'initialized' ? 500 : 600));
    };

    if (algorithm === 'dp') {
      await solver.fibonacciDP(n, animationCallback);
    } else {
      await solver.fibonacciMemo(n, animationCallback);
    }
    
    setCurrentOperation(null);
    setAnimating(false);
  };

  const clearAll = () => {
    if (!animating) {
      setDpArray([]);
      setMemoMap(new Map());
      setCallStack([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setResult(null);
      setExecutionTime(0);
      solver.clearMemo();
    }
  };

  const getArrayCellColor = (index) => {
    if (currentOperation && currentOperation.operation && algorithm === 'dp') {
      if (currentOperation.type === 'computed' && index === currentOperation.operation.n) {
        return 'bg-green-500/30 text-green-400 animate-pulse';
      }
      if (currentOperation.type === 'computed' && 
          (index === currentOperation.operation.n - 1 || index === currentOperation.operation.n - 2)) {
        return 'bg-yellow-500/30 text-yellow-400';
      }
    }
    return 'bg-slate-600 text-white';
  };

  const getCallStackColor = (depth) => {
    const colors = [
      'bg-purple-500/30 text-purple-400',
      'bg-blue-500/30 text-blue-400', 
      'bg-green-500/30 text-green-400',
      'bg-yellow-500/30 text-yellow-400',
      'bg-pink-500/30 text-pink-400',
      'bg-red-500/30 text-red-400'
    ];
    return colors[depth % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Fibonacci Sequence Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Compare Dynamic Programming vs Memoization approaches
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input N */}
            <div>
              <h3 className="text-white font-bold mb-3">Number (n)</h3>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value) || 0)}
                min="0"
                max="20"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                disabled={animating}
              />
              <div className="text-slate-400 text-xs mt-1">Range: 0-20</div>
            </div>

            {/* Algorithm Selection */}
            <div>
              <h3 className="text-white font-bold mb-3">Algorithm</h3>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={animating}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
              >
                <option value="dp">Bottom-up DP</option>
                <option value="memo">Top-down Memoization</option>
              </select>
            </div>

            {/* Result Display */}
            <div>
              <h3 className="text-white font-bold mb-3">Result</h3>
              <div className="bg-slate-700 rounded px-3 py-2 text-center">
                {result !== null ? (
                  <div>
                    <div className="text-green-400 font-bold text-xl">F({n}) = {result}</div>
                    {executionTime > 0 && (
                      <div className="text-slate-400 text-xs">
                        Time: {executionTime.toFixed(2)}ms
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-400">Click start to compute</div>
                )}
              </div>
            </div>
          </div>

          {/* Algorithm Controls */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <div className="flex justify-center gap-4">
              <button
                onClick={startFibonacci}
                disabled={animating || n < 0 || n > 20}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {animating ? 'Computing...' : `Compute F(${n})`}
              </button>
              
              <button
                onClick={clearAll}
                disabled={animating}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DP Array Visualization (for bottom-up DP) */}
          {algorithm === 'dp' && dpArray.length > 0 && (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">DP Array</h2>
              <div className="space-y-2">
                {dpArray.map((value, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-purple-400 font-bold min-w-16">
                      F({index})
                    </div>
                    <div className={`
                      px-4 py-2 rounded font-mono font-bold text-lg flex-1 text-center
                      ${getArrayCellColor(index)}
                    `}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memoization Visualization */}
          {algorithm === 'memo' && (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Memoization Cache</h2>
              {memoMap.size === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  Cache is empty
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from(memoMap.entries())
                    .sort(([a], [b]) => a - b)
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4">
                        <div className="text-purple-400 font-bold min-w-16">
                          F({key})
                        </div>
                        <div className="px-4 py-2 rounded font-mono font-bold text-lg flex-1 text-center bg-green-500/20 text-green-400">
                          {value}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Call Stack Visualization (for memoization) */}
          {algorithm === 'memo' && (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Call Stack</h2>
              {callStack.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  Call stack is empty
                </div>
              ) : (
                <div className="space-y-2">
                  {[...callStack].reverse().map((call, index) => (
                    <div key={`${call.n}-${call.depth}-${index}`} 
                         className={`
                           px-4 py-2 rounded font-mono font-bold text-sm text-center
                           ${getCallStackColor(call.depth)}
                         `}
                         style={{marginLeft: `${call.depth * 20}px`}}>
                      F({call.n}) - Depth {call.depth}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current Operation Display */}
        {currentOperation && currentOperation.operation && (
          <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-bold mb-3 text-center">Current Operation</h3>
            <div className="text-center">
              <div className={`
                inline-block px-4 py-2 rounded-lg font-semibold
                ${currentOperation.type === 'computed' ? 'bg-green-500/20 text-green-400' : 
                  currentOperation.type === 'memo_hit' ? 'bg-blue-500/20 text-blue-400' :
                  currentOperation.type === 'base_case' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'}
              `}>
                {algorithm === 'dp' && currentOperation.type === 'computed' && 
                  `Computing F(${currentOperation.operation.n}): F(${currentOperation.operation.n-1}) + F(${currentOperation.operation.n-2}) = ${currentOperation.operation.prev1} + ${currentOperation.operation.prev2} = ${currentOperation.operation.value}`
                }
                {algorithm === 'memo' && currentOperation.type === 'call' && 
                  `Calling F(${currentOperation.operation.n}) at depth ${currentOperation.operation.depth}`
                }
                {algorithm === 'memo' && currentOperation.type === 'memo_hit' && 
                  `Cache hit: F(${currentOperation.operation.n}) = ${currentOperation.operation.result}`
                }
                {algorithm === 'memo' && currentOperation.type === 'base_case' && 
                  `Base case: F(${currentOperation.operation.n}) = ${currentOperation.operation.result}`
                }
                {algorithm === 'memo' && currentOperation.type === 'computed' && 
                  `Computing F(${currentOperation.operation.n}): ${currentOperation.operation.fib1} + ${currentOperation.operation.fib2} = ${currentOperation.operation.result}`
                }
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Complete */}
        {algorithmComplete && (
          <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="text-center">
              <h3 className="text-green-400 font-bold text-xl mb-2">
                Fibonacci Computation Complete!
              </h3>
              <div className="text-2xl font-bold text-white mb-2">
                F({n}) = {result}
              </div>
              <div className="text-slate-300">
                Algorithm: {algorithm === 'dp' ? 'Bottom-up Dynamic Programming' : 'Top-down Memoization'}
              </div>
              {executionTime > 0 && (
                <div className="text-slate-400 mt-1">
                  Execution time: {executionTime.toFixed(2)} milliseconds
                </div>
              )}
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">Fibonacci Algorithm Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h4 className="text-purple-400 font-bold mb-3">Bottom-up DP</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-slate-400">Time:</span> <span className="text-white">O(n)</span></div>
                <div><span className="text-slate-400">Space:</span> <span className="text-white">O(n)</span></div>
                <div><span className="text-slate-400">Approach:</span> <span className="text-white">Iterative, builds from F(0)</span></div>
                <div><span className="text-slate-400">Memory:</span> <span className="text-white">Array storage</span></div>
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h4 className="text-pink-400 font-bold mb-3">Top-down Memoization</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-slate-400">Time:</span> <span className="text-white">O(n)</span></div>
                <div><span className="text-slate-400">Space:</span> <span className="text-white">O(n)</span></div>
                <div><span className="text-slate-400">Approach:</span> <span className="text-white">Recursive, caches results</span></div>
                <div><span className="text-slate-400">Memory:</span> <span className="text-white">HashMap storage</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
