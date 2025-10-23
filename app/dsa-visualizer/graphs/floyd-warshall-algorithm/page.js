'use client';
import { useState } from 'react';

class WeightedDirectedGraph {
  constructor() {
    this.vertices = [];
    this.adjacencyMatrix = [];
  }

  addVertex(vertex) {
    if (!this.vertices.includes(vertex)) {
      const size = this.vertices.length;
      this.vertices.push(vertex);
      
      // Extend existing rows
      for (let i = 0; i < size; i++) {
        this.adjacencyMatrix[i].push(Infinity);
      }
      
      // Add new row
      const newRow = new Array(size + 1).fill(Infinity);
      newRow[size] = 0; // Distance from vertex to itself is 0
      this.adjacencyMatrix.push(newRow);
      
      // Set diagonal to 0 for existing vertices
      for (let i = 0; i < size; i++) {
        this.adjacencyMatrix[i][i] = 0;
      }
    }
  }

  addEdge(from, to, weight) {
    this.addVertex(from);
    this.addVertex(to);
    
    const fromIndex = this.vertices.indexOf(from);
    const toIndex = this.vertices.indexOf(to);
    
    this.adjacencyMatrix[fromIndex][toIndex] = weight;
  }

  getVertices() {
    return this.vertices;
  }

  getEdges() {
    const edges = [];
    for (let i = 0; i < this.vertices.length; i++) {
      for (let j = 0; j < this.vertices.length; j++) {
        if (i !== j && this.adjacencyMatrix[i][j] !== Infinity) {
          edges.push([this.vertices[i], this.vertices[j], this.adjacencyMatrix[i][j]]);
        }
      }
    }
    return edges;
  }

  async floydWarshall(callback) {
    const n = this.vertices.length;
    const dist = this.adjacencyMatrix.map(row => [...row]);
    
    await callback('initialized', null, null, null, [...dist.map(row => [...row])]);

    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const newDistance = dist[i][k] + dist[k][j];
          
          if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && newDistance < dist[i][j]) {
            const oldDistance = dist[i][j];
            dist[i][j] = newDistance;
            
            await callback('updated', 
              { i: this.vertices[i], j: this.vertices[j], k: this.vertices[k] },
              { old: oldDistance, new: newDistance },
              { iteration: k + 1, total: n },
              [...dist.map(row => [...row])]
            );
          } else {
            await callback('checked', 
              { i: this.vertices[i], j: this.vertices[j], k: this.vertices[k] },
              { current: dist[i][j], via: newDistance === Infinity ? 'Infinity' : newDistance },
              { iteration: k + 1, total: n },
              [...dist.map(row => [...row])]
            );
          }
        }
      }
    }

    return dist;
  }

  getPath(dist, from, to) {
    const fromIndex = this.vertices.indexOf(from);
    const toIndex = this.vertices.indexOf(to);
    
    if (dist[fromIndex][toIndex] === Infinity) {
      return [];
    }
    
    // This is a simplified path reconstruction
    // In a full implementation, you'd need to track predecessors
    return [from, to];
  }
}

export default function FloydWarshallVisualization() {
  const [graph, setGraph] = useState(new WeightedDirectedGraph());
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputVertex, setInputVertex] = useState('');
  const [inputFrom, setInputFrom] = useState('');
  const [inputTo, setInputTo] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [animating, setAnimating] = useState(false);
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);
  const [iteration, setIteration] = useState({ current: 0, total: 0 });
  const [selectedPath, setSelectedPath] = useState({ from: '', to: '' });
  const [pathDistance, setPathDistance] = useState(Infinity);

  const addVertex = () => {
    if (inputVertex.trim() && !animating) {
      graph.addVertex(inputVertex.toUpperCase());
      setVertices(graph.getVertices());
      setEdges(graph.getEdges());
      setDistanceMatrix(graph.adjacencyMatrix);
      setInputVertex('');
    }
  };

  const addEdge = () => {
    if (inputFrom.trim() && inputTo.trim() && inputWeight.trim() && !animating) {
      const from = inputFrom.toUpperCase();
      const to = inputTo.toUpperCase();
      const weight = parseInt(inputWeight);
      if (weight >= 0) {
        graph.addEdge(from, to, weight);
        setVertices(graph.getVertices());
        setEdges(graph.getEdges());
        setDistanceMatrix(graph.adjacencyMatrix);
        setInputFrom('');
        setInputTo('');
        setInputWeight('');
      }
    }
  };

  const startFloydWarshall = async () => {
    if (animating || vertices.length < 2) return;

    setAnimating(true);
    setAlgorithmComplete(false);
    setCurrentOperation(null);
    setIteration({ current: 0, total: vertices.length });

    const animationCallback = async (type, operation, distance, iter, matrix) => {
      setCurrentOperation({ type, operation, distance });
      if (iter) setIteration({ current: iter.iteration, total: iter.total });
      setDistanceMatrix(matrix);
      
      await new Promise(resolve => setTimeout(resolve, type === 'initialized' ? 500 : 800));
    };

    await graph.floydWarshall(animationCallback);
    
    setCurrentOperation(null);
    setAlgorithmComplete(true);
    setAnimating(false);
  };

  const findPath = () => {
    if (!selectedPath.from.trim() || !selectedPath.to.trim() || !algorithmComplete) return;
    
    const from = selectedPath.from.toUpperCase();
    const to = selectedPath.to.toUpperCase();
    const fromIndex = vertices.indexOf(from);
    const toIndex = vertices.indexOf(to);
    
    if (fromIndex !== -1 && toIndex !== -1) {
      setPathDistance(distanceMatrix[fromIndex][toIndex]);
    }
  };

  const clearGraph = () => {
    if (!animating) {
      setGraph(new WeightedDirectedGraph());
      setVertices([]);
      setEdges([]);
      setDistanceMatrix([]);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setIteration({ current: 0, total: 0 });
      setSelectedPath({ from: '', to: '' });
      setPathDistance(Infinity);
    }
  };

  const createSampleGraph = () => {
    if (!animating) {
      const newGraph = new WeightedDirectedGraph();
      newGraph.addEdge('A', 'B', 3);
      newGraph.addEdge('A', 'D', 7);
      newGraph.addEdge('B', 'A', 8);
      newGraph.addEdge('B', 'C', 2);
      newGraph.addEdge('C', 'A', 5);
      newGraph.addEdge('C', 'D', 1);
      newGraph.addEdge('D', 'A', 2);
      
      setGraph(newGraph);
      setVertices(newGraph.getVertices());
      setEdges(newGraph.getEdges());
      setDistanceMatrix(newGraph.adjacencyMatrix);
      setCurrentOperation(null);
      setAlgorithmComplete(false);
      setIteration({ current: 0, total: 0 });
      setSelectedPath({ from: '', to: '' });
      setPathDistance(Infinity);
    }
  };

  const getVertexPosition = (vertex, index) => {
    const centerX = 200;
    const centerY = 150;
    const radius = 100;
    const angle = (2 * Math.PI * index) / vertices.length;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const formatDistance = (dist) => {
    return dist === Infinity ? '∞' : dist.toString();
  };

  const getCellColor = (i, j, value) => {
    if (i === j) return 'bg-blue-500/20 text-blue-400'; // Diagonal
    if (value === Infinity) return 'theme-surface-elevated text-slate-400';
    if (currentOperation && currentOperation.operation && 
        currentOperation.operation.i === vertices[i] && 
        currentOperation.operation.j === vertices[j]) {
      return currentOperation.type === 'updated' ? 
        'bg-green-500/30 text-green-400 animate-pulse' : 
        'bg-yellow-500/30 text-yellow-400';
    }
    return 'bg-slate-600 text-white';
  };

  return (
    <div className="min-h-screen theme-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Floyd-Warshall Algorithm Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Find shortest paths between all pairs of vertices in a weighted directed graph
          </p>
        </div>

        {/* Controls */}
        <div className="theme-surface backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Vertex */}
            <div>
              <h3 className="text-white font-bold mb-3">Add Vertex</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputVertex}
                  onChange={(e) => setInputVertex(e.target.value)}
                  placeholder="Vertex name"
                  className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addVertex}
                  disabled={!inputVertex.trim() || animating}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Add Directed Edge */}
            <div>
              <h3 className="text-white font-bold mb-3">Add Directed Edge</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputFrom}
                  onChange={(e) => setInputFrom(e.target.value)}
                  placeholder="From"
                  className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="text"
                  value={inputTo}
                  onChange={(e) => setInputTo(e.target.value)}
                  placeholder="To"
                  className="flex-1 px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="number"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder="Weight"
                  min="0"
                  className="w-20 px-3 py-2 theme-surface-elevated text-white rounded border border-slate-600 focus:border-purple-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addEdge}
                  disabled={!inputFrom.trim() || !inputTo.trim() || !inputWeight.trim() || animating}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Algorithm Controls */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={startFloydWarshall}
                disabled={animating || vertices.length < 2}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {animating ? 'Running Floyd-Warshall...' : 'Start Floyd-Warshall'}
              </button>
              
              <button
                onClick={createSampleGraph}
                disabled={animating}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
              >
                Sample Graph
              </button>
              
              <button
                onClick={clearGraph}
                disabled={animating}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Path Finder */}
            {algorithmComplete && (
              <div className="flex justify-center gap-2 items-center">
                <span className="text-white text-sm">Find shortest path:</span>
                <input
                  type="text"
                  value={selectedPath.from}
                  onChange={(e) => setSelectedPath(prev => ({ ...prev, from: e.target.value }))}
                  placeholder="From"
                  className="w-20 px-2 py-1 theme-surface-elevated text-white rounded border border-slate-600 text-sm"
                />
                <span className="text-slate-400">→</span>
                <input
                  type="text"
                  value={selectedPath.to}
                  onChange={(e) => setSelectedPath(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="To"
                  className="w-20 px-2 py-1 theme-surface-elevated text-white rounded border border-slate-600 text-sm"
                />
                <button
                  onClick={findPath}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Find
                </button>
                {pathDistance !== Infinity && (
                  <span className="text-green-400 font-bold">
                    Distance: {formatDistance(pathDistance)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graph Display */}
          <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Directed Graph</h2>
            
            {vertices.length === 0 ? (
              <div className="text-center text-slate-400 py-16">
                Add vertices and directed edges to create a graph!
              </div>
            ) : (
              <div className="relative">
                <svg width="400" height="300" className="mx-auto border border-slate-600 rounded-lg theme-bg/50">
                  {/* Render Edges */}
                  {edges.map((edge, index) => {
                    const [from, to, weight] = edge;
                    const fromIndex = vertices.indexOf(from);
                    const toIndex = vertices.indexOf(to);
                    const pos1 = getVertexPosition(from, fromIndex);
                    const pos2 = getVertexPosition(to, toIndex);
                    
                    // Calculate arrow position
                    const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
                    const endX = pos2.x - 25 * Math.cos(angle);
                    const endY = pos2.y - 25 * Math.sin(angle);
                    const startX = pos1.x + 25 * Math.cos(angle);
                    const startY = pos1.y + 25 * Math.sin(angle);
                    
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;
                    
                    return (
                      <g key={index}>
                        <line
                          x1={startX}
                          y1={startY}
                          x2={endX}
                          y2={endY}
                          stroke="#64748b"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                        {/* Weight label */}
                        <circle cx={midX} cy={midY} r="10" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                        <text
                          x={midX}
                          y={midY}
                          textAnchor="middle"
                          dy="0.35em"
                          fill="white"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {weight}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Arrow marker */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>
                  </defs>
                  
                  {/* Render Vertices */}
                  {vertices.map((vertex, index) => {
                    const pos = getVertexPosition(vertex, index);
                    
                    let vertexColor = '#475569';
                    let strokeColor = '#64748b';
                    
                    if (currentOperation && currentOperation.operation) {
                      const { i, j, k } = currentOperation.operation;
                      if (vertex === k) {
                        vertexColor = '#f59e0b';
                        strokeColor = '#d97706';
                      } else if (vertex === i || vertex === j) {
                        vertexColor = '#8b5cf6';
                        strokeColor = '#7c3aed';
                      }
                    }
                    
                    return (
                      <g key={vertex}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="22"
                          fill={vertexColor}
                          stroke={strokeColor}
                          strokeWidth="3"
                          className="transition-all duration-500"
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dy="0.35em"
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                        >
                          {vertex}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          {/* Distance Matrix */}
          <div className="theme-surface/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Distance Matrix
              {iteration.total > 0 && (
                <span className="text-sm text-slate-400 ml-2">
                  (Iteration {iteration.current}/{iteration.total})
                </span>
              )}
            </h2>
            
            {distanceMatrix.length === 0 ? (
              <div className="text-center text-slate-400 py-16">
                Add vertices to see the distance matrix
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-slate-400 font-bold">From/To</th>
                      {vertices.map(vertex => (
                        <th key={vertex} className="p-2 theme-accent font-bold min-w-12">
                          {vertex}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vertices.map((fromVertex, i) => (
                      <tr key={fromVertex}>
                        <td className="p-2 theme-accent font-bold">{fromVertex}</td>
                        {vertices.map((toVertex, j) => (
                          <td key={`${i}-${j}`} className="p-2 text-center">
                            <div className={`
                              px-2 py-1 rounded font-mono font-bold text-xs min-w-8
                              ${getCellColor(i, j, distanceMatrix[i][j])}
                            `}>
                              {formatDistance(distanceMatrix[i][j])}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Current Operation Display */}
        {currentOperation && currentOperation.operation && (
          <div className="mt-6 theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-bold mb-3 text-center">Current Operation</h3>
            <div className="text-center">
              <div className={`
                inline-block px-4 py-2 rounded-lg font-semibold
                ${currentOperation.type === 'updated' ? 'bg-green-500/20 text-green-400' : 
                  'bg-yellow-500/20 text-yellow-400'}
              `}>
                {currentOperation.type === 'updated' && 
                  `Updated: dist[${currentOperation.operation.i}][${currentOperation.operation.j}] = ${currentOperation.distance.new} (via ${currentOperation.operation.k})`
                }
                {currentOperation.type === 'checked' && 
                  `Checking: dist[${currentOperation.operation.i}][${currentOperation.operation.j}] via ${currentOperation.operation.k} = ${currentOperation.distance.current} vs ${currentOperation.distance.via}`
                }
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Status */}
        {algorithmComplete && (
          <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="text-center">
              <h3 className="text-green-400 font-bold text-xl mb-2">
                Floyd-Warshall Algorithm Complete!
              </h3>
              <p className="text-slate-300">
                All shortest paths between all pairs of vertices have been computed.
              </p>
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="mt-8 theme-surface backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">Floyd-Warshall Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="theme-accent font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O(V³)</div>
            </div>
            <div className="text-center">
              <div className="text-pink-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(V²)</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold mb-2">Graph Type</div>
              <div className="text-slate-300 text-sm">Weighted Directed/Undirected</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">All-pairs shortest paths</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
