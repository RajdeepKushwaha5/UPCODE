'use client';
import { useState } from 'react';

class LCSSolver {
  constructor() {
    this.text1 = '';
    this.text2 = '';
    this.dp = [];
  }

  setTexts(text1, text2) {
    this.text1 = text1;
    this.text2 = text2;
  }

  async solveLCS(callback) {
    const m = this.text1.length;
    const n = this.text2.length;
    
    // Initialize DP table
    this.dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    await callback('initialized', null, null, [...this.dp.map(row => [...row])]);

    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (this.text1[i - 1] === this.text2[j - 1]) {
          this.dp[i][j] = this.dp[i - 1][j - 1] + 1;
          
          await callback('match', 
            { i, j, char1: this.text1[i - 1], char2: this.text2[j - 1] },
            { value: this.dp[i][j] },
            [...this.dp.map(row => [...row])]
          );
        } else {
          this.dp[i][j] = Math.max(this.dp[i - 1][j], this.dp[i][j - 1]);
          
          await callback('no_match',
            { i, j, char1: this.text1[i - 1], char2: this.text2[j - 1] },
            { fromTop: this.dp[i - 1][j], fromLeft: this.dp[i][j - 1], max: this.dp[i][j] },
            [...this.dp.map(row => [...row])]
          );
        }
      }
    }

    // Backtrack to find the LCS
    const lcs = [];
    let i = m, j = n;
    const path = [];

    while (i > 0 && j > 0) {
      path.push({ i, j });
      
      if (this.text1[i - 1] === this.text2[j - 1]) {
        lcs.unshift(this.text1[i - 1]);
        i--;
        j--;
      } else if (this.dp[i - 1][j] > this.dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    await callback('completed', 
      { lcs: lcs.join(''), length: lcs.length, path },
      null,
      [...this.dp.map(row => [...row])]
    );

    return { lcs: lcs.join(''), length: lcs.length, path };
  }
}

export default function LCSVisualization() {
  const [solver] = useState(new LCSSolver());
  const [text1, setText1] = useState('ABCDGH');
  const [text2, setText2] = useState('AEDFHR');
  const [animating, setAnimating] = useState(false);
  const [dpTable, setDpTable] = useState([]);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);
  const [result, setResult] = useState(null);

  const startLCS = async () => {
    if (animating || !text1.trim() || !text2.trim()) return;

    setAnimating(true);
    setAlgorithmComplete(false);
    setCurrentOperation(null);
    setResult(null);

    solver.setTexts(text1.trim(), text2.trim());

    const animationCallback = async (type, operation, comparison, dp) => {
      setCurrentOperation({ type, operation, comparison });
      setDpTable(dp);
      
      if (type === 'completed') {
        setResult(operation);
        setAlgorithmComplete(true);
      }
      
      await new Promise(resolve => setTimeout(resolve, type === 'initialized' ? 500 : 800));
    };

    await solver.solveLCS(animationCallback);
    
    setCurrentOperation(null);
    setAnimating(false);
  };

  const clearAll = () => {
    if (!animating) {
      setText1('');
      setText2('');
      setDpTable([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setResult(null);
    }
  };

  const createSampleTexts = () => {
    if (!animating) {
      setText1('ABCDGH');
      setText2('AEDFHR');
      setDpTable([]);
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
    
    if (result && result.path) {
      const isInPath = result.path.some(p => p.i === i && p.j === j);
      if (isInPath) {
        return 'bg-blue-500/30 text-blue-400';
      }
    }
    
    return i === 0 || j === 0 ? 
      'bg-purple-500/20 theme-accent' : 
      'bg-slate-600 text-white';
  };

  const getCharColor = (index, text, isText1 = true) => {
    if (currentOperation && currentOperation.operation) {
      const { i, j } = currentOperation.operation;
      if ((isText1 && index === i - 1) || (!isText1 && index === j - 1)) {
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
            Longest Common Subsequence (LCS) Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Find the longest subsequence common to both input strings
          </p>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Input 1 */}
            <div>
              <h3 className="text-white font-bold mb-3">Text 1</h3>
              <input
                type="text"
                value={text1}
                onChange={(e) => setText1(e.target.value.toUpperCase())}
                placeholder="Enter first text"
                className="w-full px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                disabled={animating}
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {text1.split('').map((char, index) => (
                  <div
                    key={index}
                    className={`
                      px-2 py-1 rounded text-sm font-mono font-bold
                      ${getCharColor(index, text1, true)}
                    `}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            {/* Text Input 2 */}
            <div>
              <h3 className="text-white font-bold mb-3">Text 2</h3>
              <input
                type="text"
                value={text2}
                onChange={(e) => setText2(e.target.value.toUpperCase())}
                placeholder="Enter second text"
                className="w-full px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                disabled={animating}
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {text2.split('').map((char, index) => (
                  <div
                    key={index}
                    className={`
                      px-2 py-1 rounded text-sm font-mono font-bold
                      ${getCharColor(index, text2, false)}
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
                onClick={startLCS}
                disabled={animating || !text1.trim() || !text2.trim()}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {animating ? 'Finding LCS...' : 'Find LCS'}
              </button>
              
              <button
                onClick={createSampleTexts}
                disabled={animating}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
              >
                Sample Texts
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

        {/* DP Table Visualization */}
        {dpTable.length > 0 && (
          <div className="mb-6 theme-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 text-center">LCS DP Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mx-auto">
                <thead>
                  <tr>
                    <th className="p-2 text-slate-400 font-bold">i\\j</th>
                    <th className="p-2 theme-accent font-bold">∅</th>
                    {text2.split('').map((char, index) => (
                      <th key={index} className="p-2 theme-accent font-bold min-w-12">
                        {char}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dpTable.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 theme-accent font-bold text-center">
                        {i === 0 ? '∅' : text1[i - 1]}
                      </td>
                      {row.map((value, j) => (
                        <td key={j} className="p-2 text-center">
                          <div className={`
                            px-3 py-1 rounded font-mono font-bold text-sm min-w-8
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
                  `Match found: '${currentOperation.operation.char1}' = '${currentOperation.operation.char2}' → LCS length = ${currentOperation.comparison.value}`
                }
                {currentOperation.type === 'no_match' && 
                  `No match: '${currentOperation.operation.char1}' ≠ '${currentOperation.operation.char2}' → max(${currentOperation.comparison.fromTop}, ${currentOperation.comparison.fromLeft}) = ${currentOperation.comparison.max}`
                }
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="text-center">
              <h3 className="text-green-400 font-bold text-xl mb-2">
                LCS Found!
              </h3>
              <div className="text-2xl font-bold text-white mb-2">
                Longest Common Subsequence: "{result.lcs}"
              </div>
              <div className="text-slate-300">
                Length: {result.length}
              </div>
              
              {result.lcs && (
                <div className="mt-4 flex justify-center gap-1">
                  {result.lcs.split('').map((char, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-green-500/20 text-green-400 rounded font-mono font-bold text-lg"
                    >
                      {char}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">LCS Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="theme-accent font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O(m × n)</div>
            </div>
            <div className="text-center">
              <div className="text-pink-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(m × n)</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold mb-2">Approach</div>
              <div className="text-slate-300 text-sm">Dynamic Programming</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">DNA Analysis, Diff Tools</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
