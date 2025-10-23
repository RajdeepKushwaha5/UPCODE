'use client';
import { useState } from 'react';

class EditDistanceSolver {
  constructor() {
    this.str1 = '';
    this.str2 = '';
    this.dp = [];
    this.operations = [];
  }

  setStrings(str1, str2) {
    this.str1 = str1;
    this.str2 = str2;
  }

  async solveEditDistance(callback) {
    const m = this.str1.length;
    const n = this.str2.length;
    
    // Initialize DP table
    this.dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    this.operations = Array(m + 1).fill().map(() => Array(n + 1).fill(''));

    // Initialize base cases
    for (let i = 0; i <= m; i++) {
      this.dp[i][0] = i;
      this.operations[i][0] = i > 0 ? 'delete' : '';
    }
    for (let j = 0; j <= n; j++) {
      this.dp[0][j] = j;
      this.operations[0][j] = j > 0 ? 'insert' : '';
    }

    await callback('initialized', null, null, 
      [...this.dp.map(row => [...row])], 
      [...this.operations.map(row => [...row])]
    );

    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = this.str1[i - 1];
        const char2 = this.str2[j - 1];
        
        if (char1 === char2) {
          // No operation needed
          this.dp[i][j] = this.dp[i - 1][j - 1];
          this.operations[i][j] = 'match';
          
          await callback('match', 
            { i, j, char1, char2 },
            { cost: this.dp[i][j] },
            [...this.dp.map(row => [...row])],
            [...this.operations.map(row => [...row])]
          );
        } else {
          // Find minimum cost operation
          const substituteCost = this.dp[i - 1][j - 1] + 1;
          const deleteCost = this.dp[i - 1][j] + 1;
          const insertCost = this.dp[i][j - 1] + 1;
          
          const minCost = Math.min(substituteCost, deleteCost, insertCost);
          this.dp[i][j] = minCost;
          
          if (minCost === substituteCost) {
            this.operations[i][j] = 'substitute';
          } else if (minCost === deleteCost) {
            this.operations[i][j] = 'delete';
          } else {
            this.operations[i][j] = 'insert';
          }
          
          await callback('operation', 
            { i, j, char1, char2, operation: this.operations[i][j] },
            { substituteCost, deleteCost, insertCost, minCost },
            [...this.dp.map(row => [...row])],
            [...this.operations.map(row => [...row])]
          );
        }
      }
    }

    // Backtrack to find the sequence of operations
    const operationSequence = [];
    let i = m, j = n;

    while (i > 0 || j > 0) {
      const operation = this.operations[i][j];
      
      if (operation === 'match') {
        operationSequence.unshift({
          type: 'match',
          char1: this.str1[i - 1],
          char2: this.str2[j - 1],
          position: i - 1
        });
        i--;
        j--;
      } else if (operation === 'substitute') {
        operationSequence.unshift({
          type: 'substitute',
          from: this.str1[i - 1],
          to: this.str2[j - 1],
          position: i - 1
        });
        i--;
        j--;
      } else if (operation === 'delete') {
        operationSequence.unshift({
          type: 'delete',
          char: this.str1[i - 1],
          position: i - 1
        });
        i--;
      } else if (operation === 'insert') {
        operationSequence.unshift({
          type: 'insert',
          char: this.str2[j - 1],
          position: j - 1
        });
        j--;
      }
    }

    const result = {
      minEditDistance: this.dp[m][n],
      operationSequence,
      totalOperations: operationSequence.filter(op => op.type !== 'match').length
    };

    await callback('completed', result, null, 
      [...this.dp.map(row => [...row])],
      [...this.operations.map(row => [...row])]
    );

    return result;
  }
}

export default function EditDistanceVisualization() {
  const [solver] = useState(new EditDistanceSolver());
  const [str1, setStr1] = useState('INTENTION');
  const [str2, setStr2] = useState('EXECUTION');
  const [animating, setAnimating] = useState(false);
  const [dpTable, setDpTable] = useState([]);
  const [operationsTable, setOperationsTable] = useState([]);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);
  const [result, setResult] = useState(null);

  const startEditDistance = async () => {
    if (animating || !str1.trim() || !str2.trim()) return;

    setAnimating(true);
    setAlgorithmComplete(false);
    setCurrentOperation(null);
    setResult(null);

    solver.setStrings(str1.trim(), str2.trim());

    const animationCallback = async (type, operation, comparison, dp, ops) => {
      setCurrentOperation({ type, operation, comparison });
      setDpTable(dp);
      setOperationsTable(ops);
      
      if (type === 'completed') {
        setResult(operation);
        setAlgorithmComplete(true);
      }
      
      await new Promise(resolve => setTimeout(resolve, type === 'initialized' ? 500 : 800));
    };

    await solver.solveEditDistance(animationCallback);
    
    setCurrentOperation(null);
    setAnimating(false);
  };

  const clearAll = () => {
    if (!animating) {
      setStr1('');
      setStr2('');
      setDpTable([]);
      setOperationsTable([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setResult(null);
    }
  };

  const createSampleStrings = () => {
    if (!animating) {
      setStr1('INTENTION');
      setStr2('EXECUTION');
      setDpTable([]);
      setOperationsTable([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setResult(null);
    }
  };

  const getCellColor = (i, j) => {
    if (currentOperation && currentOperation.operation) {
      const { i: opI, j: opJ } = currentOperation.operation;
      if (i === opI && j === opJ) {
        return currentOperation.type === 'match' ? 
          'bg-green-500/30 text-green-400 animate-pulse' : 
          'bg-yellow-500/30 text-yellow-400 animate-pulse';
      }
    }
    
    return i === 0 || j === 0 ? 
      'bg-purple-500/20 theme-accent' : 
      'bg-slate-600 text-white';
  };

  const getOperationColor = (operation) => {
    switch (operation) {
      case 'match': return 'bg-green-500/20 text-green-400';
      case 'substitute': return 'bg-yellow-500/20 text-yellow-400';
      case 'delete': return 'bg-red-500/20 text-red-400';
      case 'insert': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-600 text-slate-400';
    }
  };

  const getOperationSymbol = (operation) => {
    switch (operation) {
      case 'match': return '=';
      case 'substitute': return '↔';
      case 'delete': return '✕';
      case 'insert': return '+';
      default: return '';
    }
  };

  const getCharColor = (index, str, isStr1 = true) => {
    if (currentOperation && currentOperation.operation) {
      const { i, j } = currentOperation.operation;
      if ((isStr1 && index === i - 1) || (!isStr1 && index === j - 1)) {
        return currentOperation.type === 'match' ? 
          'bg-green-500/30 text-green-400 animate-pulse' : 
          'bg-yellow-500/30 text-yellow-400 animate-pulse';
      }
    }
    return 'bg-slate-600 text-white';
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Edit Distance (Levenshtein Distance) Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Find the minimum number of operations to transform one string into another
          </p>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* String 1 */}
            <div>
              <h3 className="text-white font-bold mb-3">Source String</h3>
              <input
                type="text"
                value={str1}
                onChange={(e) => setStr1(e.target.value.toUpperCase())}
                placeholder="Enter source string"
                className="w-full px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                disabled={animating}
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {str1.split('').map((char, index) => (
                  <div
                    key={index}
                    className={`
                      px-2 py-1 rounded text-sm font-mono font-bold
                      ${getCharColor(index, str1, true)}
                    `}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            {/* String 2 */}
            <div>
              <h3 className="text-white font-bold mb-3">Target String</h3>
              <input
                type="text"
                value={str2}
                onChange={(e) => setStr2(e.target.value.toUpperCase())}
                placeholder="Enter target string"
                className="w-full px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                disabled={animating}
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {str2.split('').map((char, index) => (
                  <div
                    key={index}
                    className={`
                      px-2 py-1 rounded text-sm font-mono font-bold
                      ${getCharColor(index, str2, false)}
                    `}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Algorithm Controls */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <div className="flex justify-center gap-4">
              <button
                onClick={startEditDistance}
                disabled={animating || !str1.trim() || !str2.trim()}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {animating ? 'Computing...' : 'Calculate Edit Distance'}
              </button>
              
              <button
                onClick={createSampleStrings}
                disabled={animating}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
              >
                Sample Strings
              </button>
              
              <button
                onClick={clearAll}
                disabled={animating}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* DP Tables Visualization */}
        {dpTable.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {/* Cost Table */}
            <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Edit Distance DP Table</h2>
              <div className="overflow-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="p-1 text-slate-400 font-bold">i\\j</th>
                      <th className="p-1 theme-accent font-bold">∅</th>
                      {str2.split('').map((char, index) => (
                        <th key={index} className="p-1 theme-accent font-bold min-w-8">
                          {char}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dpTable.map((row, i) => (
                      <tr key={i}>
                        <td className="p-1 theme-accent font-bold text-center">
                          {i === 0 ? '∅' : str1[i - 1]}
                        </td>
                        {row.map((value, j) => (
                          <td key={j} className="p-1 text-center">
                            <div className={`
                              px-2 py-1 rounded font-mono font-bold text-xs min-w-6
                              ${getCellColor(i, j)}
                            `}>
                              {value}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operations Table */}
            <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Operations Table</h2>
              <div className="overflow-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="p-1 text-slate-400 font-bold">i\\j</th>
                      <th className="p-1 theme-accent font-bold">∅</th>
                      {str2.split('').map((char, index) => (
                        <th key={index} className="p-1 theme-accent font-bold min-w-8">
                          {char}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {operationsTable.map((row, i) => (
                      <tr key={i}>
                        <td className="p-1 theme-accent font-bold text-center">
                          {i === 0 ? '∅' : str1[i - 1]}
                        </td>
                        {row.map((operation, j) => (
                          <td key={j} className="p-1 text-center">
                            <div className={`
                              px-2 py-1 rounded font-mono font-bold text-xs min-w-6
                              ${getOperationColor(operation)}
                            `}>
                              {getOperationSymbol(operation)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Current Operation Display */}
        {currentOperation && currentOperation.operation && (
          <div className="mb-6 theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-bold mb-3 text-center">Current Comparison</h3>
            <div className="text-center">
              <div className={`
                inline-block px-4 py-2 rounded-lg font-semibold
                ${currentOperation.type === 'match' ? 'bg-green-500/20 text-green-400' : 
                  'bg-yellow-500/20 text-yellow-400'}
              `}>
                {currentOperation.type === 'match' && 
                  `Match: '${currentOperation.operation.char1}' = '${currentOperation.operation.char2}' → Cost: ${currentOperation.comparison.cost}`
                }
                {currentOperation.type === 'operation' && 
                  `Comparing '${currentOperation.operation.char1}' vs '${currentOperation.operation.char2}': Substitute(${currentOperation.comparison.substituteCost}) | Delete(${currentOperation.comparison.deleteCost}) | Insert(${currentOperation.comparison.insertCost}) → ${currentOperation.operation.operation.toUpperCase()}(${currentOperation.comparison.minCost})`
                }
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-green-400 font-bold text-xl mb-2">
                Edit Distance Calculated!
              </h3>
              <div className="text-2xl font-bold text-white mb-2">
                Minimum Edit Distance: {result.minEditDistance}
              </div>
              <div className="text-slate-300">
                Total Operations Needed: {result.totalOperations}
              </div>
            </div>

            {/* Operation Sequence */}
            <div className="theme-surface/30 rounded-xl p-4">
              <h4 className="text-white font-bold mb-3 text-center">Operation Sequence</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {result.operationSequence.map((op, index) => (
                  <div key={index} className={`
                    px-3 py-2 rounded text-sm font-mono
                    ${getOperationColor(op.type)}
                  `}>
                    {op.type === 'match' && `${index + 1}. Keep '${op.char1}' (position ${op.position})`}
                    {op.type === 'substitute' && `${index + 1}. Substitute '${op.from}' → '${op.to}' (position ${op.position})`}
                    {op.type === 'delete' && `${index + 1}. Delete '${op.char}' (position ${op.position})`}
                    {op.type === 'insert' && `${index + 1}. Insert '${op.char}' (position ${op.position})`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">Edit Distance Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="theme-accent font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O(m × n)</div>
            </div>
            <div className="text-center">
              <div className="text-pink-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(m × n)</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold mb-2">Operations</div>
              <div className="text-slate-300 text-sm">Insert, Delete, Substitute</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">Spell Check, DNA Analysis</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="border-t border-slate-600 pt-4">
            <h4 className="text-white font-bold mb-2">Operation Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/20 rounded"></div>
                <span className="text-slate-300">= Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500/20 rounded"></div>
                <span className="text-slate-300">↔ Substitute</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/20 rounded"></div>
                <span className="text-slate-300">✕ Delete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500/20 rounded"></div>
                <span className="text-slate-300">+ Insert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
