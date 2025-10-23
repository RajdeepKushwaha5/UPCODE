'use client';
import { useState } from 'react';

class KnapsackSolver {
  constructor() {
    this.items = [];
    this.capacity = 0;
    this.dp = [];
    this.keep = [];
  }

  setItems(items) {
    this.items = items;
  }

  setCapacity(capacity) {
    this.capacity = capacity;
  }

  async solveKnapsack(callback) {
    const n = this.items.length;
    const W = this.capacity;
    
    // Initialize DP table
    this.dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
    this.keep = Array(n + 1).fill().map(() => Array(W + 1).fill(false));

    await callback('initialized', null, null, [...this.dp.map(row => [...row])], [...this.keep.map(row => [...row])]);

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= W; w++) {
        const item = this.items[i - 1];
        
        if (item.weight <= w) {
          const include = this.dp[i - 1][w - item.weight] + item.value;
          const exclude = this.dp[i - 1][w];
          
          if (include > exclude) {
            this.dp[i][w] = include;
            this.keep[i][w] = true;
            
            await callback('included', 
              { item: item, row: i, col: w },
              { include: include, exclude: exclude },
              [...this.dp.map(row => [...row])],
              [...this.keep.map(row => [...row])]
            );
          } else {
            this.dp[i][w] = exclude;
            this.keep[i][w] = false;
            
            await callback('excluded',
              { item: item, row: i, col: w },
              { include: include, exclude: exclude },
              [...this.dp.map(row => [...row])],
              [...this.keep.map(row => [...row])]
            );
          }
        } else {
          this.dp[i][w] = this.dp[i - 1][w];
          this.keep[i][w] = false;
          
          await callback('too_heavy',
            { item: item, row: i, col: w },
            { weight: item.weight, capacity: w },
            [...this.dp.map(row => [...row])],
            [...this.keep.map(row => [...row])]
          );
        }
      }
    }

    // Backtrack to find selected items
    const selectedItems = [];
    let w = W;
    for (let i = n; i > 0; i--) {
      if (this.keep[i][w]) {
        selectedItems.unshift(this.items[i - 1]);
        w -= this.items[i - 1].weight;
      }
    }

    await callback('completed', 
      { selectedItems, maxValue: this.dp[n][W] },
      null,
      [...this.dp.map(row => [...row])],
      [...this.keep.map(row => [...row])]
    );

    return { maxValue: this.dp[n][W], selectedItems };
  }
}

export default function KnapsackVisualization() {
  const [solver] = useState(new KnapsackSolver());
  const [items, setItems] = useState([]);
  const [capacity, setCapacity] = useState(10);
  const [inputName, setInputName] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [animating, setAnimating] = useState(false);
  const [dpTable, setDpTable] = useState([]);
  const [keepTable, setKeepTable] = useState([]);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);
  const [result, setResult] = useState(null);

  const addItem = () => {
    if (inputName.trim() && inputWeight.trim() && inputValue.trim() && !animating) {
      const weight = parseInt(inputWeight);
      const value = parseInt(inputValue);
      
      if (weight > 0 && value > 0) {
        const newItems = [...items, { name: inputName, weight, value }];
        setItems(newItems);
        setInputName('');
        setInputWeight('');
        setInputValue('');
      }
    }
  };

  const removeItem = (index) => {
    if (!animating) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const startKnapsack = async () => {
    if (animating || items.length === 0 || capacity <= 0) return;

    setAnimating(true);
    setAlgorithmComplete(false);
    setCurrentOperation(null);
    setResult(null);

    solver.setItems(items);
    solver.setCapacity(capacity);

    const animationCallback = async (type, operation, comparison, dp, keep) => {
      setCurrentOperation({ type, operation, comparison });
      setDpTable(dp);
      setKeepTable(keep);
      
      if (type === 'completed') {
        setResult(operation);
        setAlgorithmComplete(true);
      }
      
      await new Promise(resolve => setTimeout(resolve, type === 'initialized' ? 500 : 1000));
    };

    await solver.solveKnapsack(animationCallback);
    
    setCurrentOperation(null);
    setAnimating(false);
  };

  const clearAll = () => {
    if (!animating) {
      setItems([]);
      setCapacity(10);
      setDpTable([]);
      setKeepTable([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setResult(null);
    }
  };

  const createSampleItems = () => {
    if (!animating) {
      setItems([
        { name: 'Gold', weight: 4, value: 10 },
        { name: 'Silver', weight: 6, value: 8 },
        { name: 'Diamond', weight: 2, value: 15 },
        { name: 'Ruby', weight: 3, value: 7 },
        { name: 'Emerald', weight: 5, value: 12 }
      ]);
      setCapacity(10);
      setDpTable([]);
      setKeepTable([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setResult(null);
    }
  };

  const getCellColor = (i, j, isKeepTable = false) => {
    if (currentOperation && currentOperation.operation) {
      const { row, col } = currentOperation.operation;
      if (i === row && j === col) {
        if (isKeepTable) {
          return currentOperation.type === 'included' ? 
            'bg-green-500/30 text-green-400 animate-pulse' : 
            'bg-red-500/30 text-red-400 animate-pulse';
        } else {
          return 'bg-yellow-500/30 text-yellow-400 animate-pulse';
        }
      }
    }
    
    if (isKeepTable) {
      return keepTable[i] && keepTable[i][j] ? 
        'bg-green-500/20 text-green-400' : 
        'bg-slate-600 text-slate-400';
    }
    
    return i === 0 || j === 0 ? 
      'bg-blue-500/20 text-blue-400' : 
      'bg-slate-600 text-white';
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            0/1 Knapsack Problem Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Find the optimal combination of items to maximize value within weight constraint
          </p>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Item */}
            <div>
              <h3 className="text-white font-bold mb-3">Add Item</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Item name"
                    className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                    disabled={animating}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputWeight}
                    onChange={(e) => setInputWeight(e.target.value)}
                    placeholder="Weight"
                    min="1"
                    className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                    disabled={animating}
                  />
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Value"
                    min="1"
                    className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                    disabled={animating}
                  />
                  <button
                    onClick={addItem}
                    disabled={!inputName.trim() || !inputWeight.trim() || !inputValue.trim() || animating}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Knapsack Capacity */}
            <div>
              <h3 className="text-white font-bold mb-3">Knapsack Capacity</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                  min="1"
                  max="20"
                  className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                  disabled={animating}
                />
                <span className="text-slate-400">units</span>
              </div>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-600">
              <h3 className="text-white font-bold mb-3">Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between theme-surface-elevated/50 rounded-lg p-3">
                    <div>
                      <div className="text-white font-semibold">{item.name}</div>
                      <div className="text-slate-400 text-sm">
                        Weight: {item.weight}, Value: {item.value}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      disabled={animating}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Algorithm Controls */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <div className="flex justify-center gap-4">
              <button
                onClick={startKnapsack}
                disabled={animating || items.length === 0 || capacity <= 0}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {animating ? 'Solving...' : 'Solve Knapsack'}
              </button>
              
              <button
                onClick={createSampleItems}
                disabled={animating}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
              >
                Sample Items
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Value Table */}
            <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">DP Value Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="p-1 text-slate-400 font-bold">Item/W</th>
                      {Array.from({ length: capacity + 1 }, (_, i) => (
                        <th key={i} className="p-1 theme-accent font-bold min-w-8">
                          {i}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dpTable.map((row, i) => (
                      <tr key={i}>
                        <td className="p-1 theme-accent font-bold">
                          {i === 0 ? '∅' : items[i - 1]?.name || `Item ${i}`}
                        </td>
                        {row.map((value, j) => (
                          <td key={j} className="p-1 text-center">
                            <div className={`
                              px-1 py-0.5 rounded font-mono font-bold text-xs min-w-6
                              ${getCellColor(i, j, false)}
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

            {/* Keep Table */}
            <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Keep Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="p-1 text-slate-400 font-bold">Item/W</th>
                      {Array.from({ length: capacity + 1 }, (_, i) => (
                        <th key={i} className="p-1 theme-accent font-bold min-w-8">
                          {i}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {keepTable.map((row, i) => (
                      <tr key={i}>
                        <td className="p-1 theme-accent font-bold">
                          {i === 0 ? '∅' : items[i - 1]?.name || `Item ${i}`}
                        </td>
                        {row.map((keep, j) => (
                          <td key={j} className="p-1 text-center">
                            <div className={`
                              px-1 py-0.5 rounded font-mono font-bold text-xs min-w-6
                              ${getCellColor(i, j, true)}
                            `}>
                              {keep ? '✓' : '✗'}
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
            <h3 className="text-white font-bold mb-3 text-center">Current Decision</h3>
            <div className="text-center">
              <div className={`
                inline-block px-4 py-2 rounded-lg font-semibold
                ${currentOperation.type === 'included' ? 'bg-green-500/20 text-green-400' : 
                  currentOperation.type === 'excluded' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'}
              `}>
                {currentOperation.type === 'included' && 
                  `Including ${currentOperation.operation.item.name}: Value ${currentOperation.comparison.include} > ${currentOperation.comparison.exclude}`
                }
                {currentOperation.type === 'excluded' && 
                  `Excluding ${currentOperation.operation.item.name}: Value ${currentOperation.comparison.exclude} ≥ ${currentOperation.comparison.include}`
                }
                {currentOperation.type === 'too_heavy' && 
                  `${currentOperation.operation.item.name} too heavy: Weight ${currentOperation.comparison.weight} > Capacity ${currentOperation.comparison.capacity}`
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
                Optimal Solution Found!
              </h3>
              <div className="text-2xl font-bold text-white mb-2">
                Maximum Value: {result.maxValue}
              </div>
              <div className="text-slate-300">
                Total Weight: {result.selectedItems.reduce((sum, item) => sum + item.weight, 0)} / {capacity}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.selectedItems.map((item, index) => (
                <div key={index} className="bg-green-500/20 rounded-lg p-4 text-center">
                  <div className="text-green-400 font-bold">{item.name}</div>
                  <div className="text-slate-300 text-sm">
                    Weight: {item.weight}, Value: {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">0/1 Knapsack Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="theme-accent font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O(n × W)</div>
            </div>
            <div className="text-center">
              <div className="text-pink-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(n × W)</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold mb-2">Approach</div>
              <div className="text-slate-300 text-sm">Dynamic Programming</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">Resource Optimization</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
