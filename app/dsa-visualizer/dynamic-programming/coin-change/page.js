'use client';
import { useState } from 'react';

class CoinChangeSolver {
  constructor() {
    this.coins = [];
    this.amount = 0;
    this.dp = [];
    this.coinUsed = [];
  }

  setCoins(coins) {
    this.coins = [...coins].sort((a, b) => a - b);
  }

  setAmount(amount) {
    this.amount = amount;
  }

  async solveCoinChange(callback) {
    const n = this.amount;
    
    // Initialize DP arrays
    this.dp = Array(n + 1).fill(Infinity);
    this.coinUsed = Array(n + 1).fill(-1);
    this.dp[0] = 0;

    await callback('initialized', null, null, [...this.dp], [...this.coinUsed]);

    // Fill the DP table
    for (let amount = 1; amount <= n; amount++) {
      for (let coinIndex = 0; coinIndex < this.coins.length; coinIndex++) {
        const coin = this.coins[coinIndex];
        
        if (coin <= amount) {
          const newCount = this.dp[amount - coin] + 1;
          
          if (newCount < this.dp[amount]) {
            this.dp[amount] = newCount;
            this.coinUsed[amount] = coin;
            
            await callback('updated', 
              { amount, coin, newCount, oldCount: this.dp[amount] === newCount ? Infinity : this.dp[amount] },
              { fromAmount: amount - coin, fromCount: this.dp[amount - coin] },
              [...this.dp],
              [...this.coinUsed]
            );
          } else {
            await callback('no_update',
              { amount, coin, currentCount: this.dp[amount], newCount },
              { fromAmount: amount - coin, fromCount: this.dp[amount - coin] },
              [...this.dp],
              [...this.coinUsed]
            );
          }
        } else {
          await callback('coin_too_large',
            { amount, coin },
            null,
            [...this.dp],
            [...this.coinUsed]
          );
        }
      }
    }

    // Reconstruct the solution
    const usedCoins = [];
    let currentAmount = n;
    
    while (currentAmount > 0 && this.coinUsed[currentAmount] !== -1) {
      const coin = this.coinUsed[currentAmount];
      usedCoins.push(coin);
      currentAmount -= coin;
    }

    const result = {
      minCoins: this.dp[n] === Infinity ? -1 : this.dp[n],
      coinCombination: this.dp[n] === Infinity ? [] : usedCoins,
      possible: this.dp[n] !== Infinity
    };

    await callback('completed', result, null, [...this.dp], [...this.coinUsed]);

    return result;
  }
}

export default function CoinChangeVisualization() {
  const [solver] = useState(new CoinChangeSolver());
  const [coins, setCoins] = useState([1, 5, 10, 25]);
  const [amount, setAmount] = useState(30);
  const [inputCoin, setInputCoin] = useState('');
  const [animating, setAnimating] = useState(false);
  const [dpArray, setDpArray] = useState([]);
  const [coinUsedArray, setCoinUsedArray] = useState([]);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);
  const [result, setResult] = useState(null);

  const addCoin = () => {
    if (inputCoin.trim() && !animating) {
      const coinValue = parseInt(inputCoin);
      if (coinValue > 0 && !coins.includes(coinValue)) {
        const newCoins = [...coins, coinValue].sort((a, b) => a - b);
        setCoins(newCoins);
        setInputCoin('');
      }
    }
  };

  const removeCoin = (coinToRemove) => {
    if (!animating) {
      setCoins(coins.filter(coin => coin !== coinToRemove));
    }
  };

  const startCoinChange = async () => {
    if (animating || coins.length === 0 || amount <= 0) return;

    setAnimating(true);
    setAlgorithmComplete(false);
    setCurrentOperation(null);
    setResult(null);

    solver.setCoins(coins);
    solver.setAmount(amount);

    const animationCallback = async (type, operation, comparison, dp, coinUsed) => {
      setCurrentOperation({ type, operation, comparison });
      setDpArray(dp);
      setCoinUsedArray(coinUsed);
      
      if (type === 'completed') {
        setResult(operation);
        setAlgorithmComplete(true);
      }
      
      await new Promise(resolve => setTimeout(resolve, type === 'initialized' ? 500 : 800));
    };

    await solver.solveCoinChange(animationCallback);
    
    setCurrentOperation(null);
    setAnimating(false);
  };

  const clearAll = () => {
    if (!animating) {
      setCoins([1, 5, 10, 25]);
      setAmount(30);
      setDpArray([]);
      setCoinUsedArray([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setResult(null);
    }
  };

  const createSampleProblem = () => {
    if (!animating) {
      setCoins([1, 5, 10, 25]);
      setAmount(30);
      setDpArray([]);
      setCoinUsedArray([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setResult(null);
    }
  };

  const getCellColor = (index) => {
    if (currentOperation && currentOperation.operation) {
      if (currentOperation.operation.amount === index) {
        if (currentOperation.type === 'updated') {
          return 'bg-green-500/30 text-green-400 animate-pulse';
        } else if (currentOperation.type === 'no_update') {
          return 'bg-yellow-500/30 text-yellow-400 animate-pulse';
        }
      }
      if (currentOperation.comparison && currentOperation.comparison.fromAmount === index) {
        return 'bg-blue-500/30 text-blue-400';
      }
    }
    
    return index === 0 ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-600 text-white';
  };

  const formatDpValue = (value) => {
    return value === Infinity ? '∞' : value.toString();
  };

  const getCoinColor = (coin) => {
    if (currentOperation && currentOperation.operation && currentOperation.operation.coin === coin) {
      if (currentOperation.type === 'updated') {
        return 'bg-green-500/30 text-green-400 animate-pulse';
      } else if (currentOperation.type === 'no_update' || currentOperation.type === 'coin_too_large') {
        return 'bg-yellow-500/30 text-yellow-400 animate-pulse';
      }
    }
    return 'bg-blue-500/20 text-blue-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Coin Change Problem Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Find the minimum number of coins needed to make a given amount
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Coin */}
            <div>
              <h3 className="text-white font-bold mb-3">Add Coin Denomination</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputCoin}
                  onChange={(e) => setInputCoin(e.target.value)}
                  placeholder="Coin value"
                  min="1"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addCoin}
                  disabled={!inputCoin.trim() || animating}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Target Amount */}
            <div>
              <h3 className="text-white font-bold mb-3">Target Amount</h3>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                min="1"
                max="50"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                disabled={animating}
              />
              <div className="text-slate-400 text-xs mt-1">Range: 1-50</div>
            </div>
          </div>

          {/* Coins Display */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <h3 className="text-white font-bold mb-3">Available Coins</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {coins.map((coin, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg font-semibold
                    ${getCoinColor(coin)}
                  `}
                >
                  <span>{coin}</span>
                  <button
                    onClick={() => removeCoin(coin)}
                    disabled={animating}
                    className="text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithm Controls */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <div className="flex justify-center gap-4">
              <button
                onClick={startCoinChange}
                disabled={animating || coins.length === 0 || amount <= 0}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {animating ? 'Solving...' : 'Solve Coin Change'}
              </button>
              
              <button
                onClick={createSampleProblem}
                disabled={animating}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
              >
                Sample Problem
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
        {dpArray.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* DP Array */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Minimum Coins DP Array</h2>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {dpArray.map((value, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-purple-400 font-bold min-w-16 text-sm">
                      Amount {index}
                    </div>
                    <div className={`
                      px-3 py-1 rounded font-mono font-bold text-sm flex-1 text-center
                      ${getCellColor(index)}
                    `}>
                      {formatDpValue(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coin Used Array */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Last Coin Used</h2>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {coinUsedArray.map((coin, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-purple-400 font-bold min-w-16 text-sm">
                      Amount {index}
                    </div>
                    <div className={`
                      px-3 py-1 rounded font-mono font-bold text-sm flex-1 text-center
                      ${getCellColor(index)}
                    `}>
                      {coin === -1 ? '-' : coin}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Operation Display */}
        {currentOperation && currentOperation.operation && (
          <div className="mb-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-bold mb-3 text-center">Current Operation</h3>
            <div className="text-center">
              <div className={`
                inline-block px-4 py-2 rounded-lg font-semibold
                ${currentOperation.type === 'updated' ? 'bg-green-500/20 text-green-400' : 
                  currentOperation.type === 'no_update' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'}
              `}>
                {currentOperation.type === 'updated' && 
                  `Updated: Amount ${currentOperation.operation.amount} using coin ${currentOperation.operation.coin}: ${currentOperation.comparison.fromCount} + 1 = ${currentOperation.operation.newCount} coins`
                }
                {currentOperation.type === 'no_update' && 
                  `No update: Amount ${currentOperation.operation.amount} using coin ${currentOperation.operation.coin}: ${currentOperation.operation.newCount} ≥ ${currentOperation.operation.currentCount}`
                }
                {currentOperation.type === 'coin_too_large' && 
                  `Coin ${currentOperation.operation.coin} too large for amount ${currentOperation.operation.amount}`
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
                {result.possible ? 'Solution Found!' : 'No Solution Possible'}
              </h3>
              {result.possible ? (
                <div>
                  <div className="text-2xl font-bold text-white mb-2">
                    Minimum Coins: {result.minCoins}
                  </div>
                  <div className="text-slate-300 mb-4">
                    Target Amount: {amount}
                  </div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {result.coinCombination.map((coin, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-green-500/20 text-green-400 rounded font-mono font-bold"
                      >
                        {coin}
                      </div>
                    ))}
                  </div>
                  <div className="text-slate-400 text-sm mt-2">
                    Sum: {result.coinCombination.reduce((sum, coin) => sum + coin, 0)}
                  </div>
                </div>
              ) : (
                <div className="text-red-400 text-lg">
                  Cannot make amount {amount} with the given coin denominations
                </div>
              )}
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">Coin Change Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-purple-400 font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O(amount × coins)</div>
            </div>
            <div className="text-center">
              <div className="text-pink-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(amount)</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold mb-2">Approach</div>
              <div className="text-slate-300 text-sm">Dynamic Programming</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">Change Making, Currency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
