'use client';
import { useState } from 'react';

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, directed = false) {
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    
    this.adjacencyList[vertex1].push(vertex2);
    if (!directed) {
      this.adjacencyList[vertex2].push(vertex1);
    }
  }

  getVertices() {
    return Object.keys(this.adjacencyList);
  }

  getEdges() {
    const edges = [];
    for (let vertex in this.adjacencyList) {
      for (let neighbor of this.adjacencyList[vertex]) {
        // Avoid duplicate edges for undirected graph
        if (vertex < neighbor) {
          edges.push([vertex, neighbor]);
        }
      }
    }
    return edges;
  }

  async bfsTraversal(startVertex, callback) {
    const visited = new Set();
    const queue = [startVertex];
    const path = [];
    const levels = { [startVertex]: 0 };

    while (queue.length > 0) {
      const vertex = queue.shift();
      
      if (!visited.has(vertex)) {
        visited.add(vertex);
        path.push(vertex);
        
        // Call callback for animation
        await callback(vertex, [...visited], [...path], [...queue], levels[vertex]);
        
        // Add neighbors to queue
        const neighbors = this.adjacencyList[vertex] || [];
        for (let neighbor of neighbors) {
          if (!visited.has(neighbor) && !queue.includes(neighbor)) {
            queue.push(neighbor);
            levels[neighbor] = levels[vertex] + 1;
          }
        }
      }
    }
    
    return { path, levels };
  }

  findShortestPath(startVertex, endVertex) {
    if (!this.adjacencyList[startVertex] || !this.adjacencyList[endVertex]) {
      return null;
    }

    const visited = new Set();
    const queue = [{ vertex: startVertex, path: [startVertex] }];

    while (queue.length > 0) {
      const { vertex, path } = queue.shift();
      
      if (vertex === endVertex) {
        return path;
      }
      
      if (!visited.has(vertex)) {
        visited.add(vertex);
        
        const neighbors = this.adjacencyList[vertex] || [];
        for (let neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push({ 
              vertex: neighbor, 
              path: [...path, neighbor] 
            });
          }
        }
      }
    }
    
    return null; // No path found
  }
}

export default function BreadthFirstSearchVisualization() {
  const [graph, setGraph] = useState(new Graph());
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputVertex, setInputVertex] = useState('');
  const [inputEdge1, setInputEdge1] = useState('');
  const [inputEdge2, setInputEdge2] = useState('');
  const [startVertex, setStartVertex] = useState('');
  const [endVertex, setEndVertex] = useState('');
  const [animating, setAnimating] = useState(false);
  const [currentVertex, setCurrentVertex] = useState(null);
  const [visitedVertices, setVisitedVertices] = useState(new Set());
  const [traversalPath, setTraversalPath] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levels, setLevels] = useState({});
  const [isDirected, setIsDirected] = useState(false);
  const [bfsComplete, setBfsComplete] = useState(false);
  const [shortestPath, setShortestPath] = useState([]);
  const [showPath, setShowPath] = useState(false);

  const addVertex = () => {
    if (inputVertex.trim() && !animating) {
      graph.addVertex(inputVertex.toUpperCase());
      setVertices(graph.getVertices());
      setEdges(graph.getEdges());
      setInputVertex('');
    }
  };

  const addEdge = () => {
    if (inputEdge1.trim() && inputEdge2.trim() && !animating) {
      const v1 = inputEdge1.toUpperCase();
      const v2 = inputEdge2.toUpperCase();
      graph.addEdge(v1, v2, isDirected);
      setVertices(graph.getVertices());
      setEdges(graph.getEdges());
      setInputEdge1('');
      setInputEdge2('');
    }
  };

  const startBFS = async () => {
    if (!startVertex.trim() || animating) return;
    
    const start = startVertex.toUpperCase();
    if (!graph.adjacencyList[start]) {
      alert('Vertex not found in graph!');
      return;
    }

    setAnimating(true);
    setBfsComplete(false);
    setVisitedVertices(new Set());
    setTraversalPath([]);
    setCurrentVertex(null);
    setQueue([]);
    setLevels({});
    setCurrentLevel(0);
    setShowPath(false);
    setShortestPath([]);

    const animationCallback = async (vertex, visited, path, queueState, level) => {
      setCurrentVertex(vertex);
      setVisitedVertices(new Set(visited));
      setTraversalPath([...path]);
      setQueue([...queueState]);
      setCurrentLevel(level);
      
      // Update levels for visualization
      const newLevels = { ...levels };
      newLevels[vertex] = level;
      setLevels(newLevels);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
    };

    const result = await graph.bfsTraversal(start, animationCallback);
    
    setCurrentVertex(null);
    setQueue([]);
    setBfsComplete(true);
    setLevels(result.levels);
    setAnimating(false);
  };

  const findPath = () => {
    if (!startVertex.trim() || !endVertex.trim()) return;
    
    const start = startVertex.toUpperCase();
    const end = endVertex.toUpperCase();
    const path = graph.findShortestPath(start, end);
    
    if (path) {
      setShortestPath(path);
      setShowPath(true);
    } else {
      alert('No path found between vertices!');
      setShortestPath([]);
      setShowPath(false);
    }
  };

  const clearGraph = () => {
    if (!animating) {
      setGraph(new Graph());
      setVertices([]);
      setEdges([]);
      setVisitedVertices(new Set());
      setTraversalPath([]);
      setCurrentVertex(null);
      setBfsComplete(false);
      setQueue([]);
      setLevels({});
      setShortestPath([]);
      setShowPath(false);
    }
  };

  const createSampleGraph = () => {
    if (!animating) {
      const newGraph = new Graph();
      newGraph.addEdge('A', 'B');
      newGraph.addEdge('A', 'C');
      newGraph.addEdge('B', 'D');
      newGraph.addEdge('B', 'E');
      newGraph.addEdge('C', 'F');
      newGraph.addEdge('D', 'G');
      newGraph.addEdge('E', 'G');
      
      setGraph(newGraph);
      setVertices(newGraph.getVertices());
      setEdges(newGraph.getEdges());
      setVisitedVertices(new Set());
      setTraversalPath([]);
      setCurrentVertex(null);
      setBfsComplete(false);
      setQueue([]);
      setLevels({});
      setShortestPath([]);
      setShowPath(false);
    }
  };

  const getVertexPosition = (vertex, index) => {
    const centerX = 200;
    const centerY = 150;
    const radius = 120;
    const angle = (2 * Math.PI * index) / vertices.length;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const getLevelColor = (level) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[level % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Breadth-First Search (BFS) Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Explore graph vertices level by level using a queue-based approach
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-emerald-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addVertex}
                  disabled={!inputVertex.trim() || animating}
                  className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Add Edge */}
            <div>
              <h3 className="text-white font-bold mb-3">Add Edge</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={inputEdge1}
                  onChange={(e) => setInputEdge1(e.target.value)}
                  placeholder="From"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-emerald-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="text"
                  value={inputEdge2}
                  onChange={(e) => setInputEdge2(e.target.value)}
                  placeholder="To"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-emerald-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addEdge}
                  disabled={!inputEdge1.trim() || !inputEdge2.trim() || animating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="directed"
                  checked={isDirected}
                  onChange={(e) => setIsDirected(e.target.checked)}
                  disabled={animating}
                  className="text-emerald-500"
                />
                <label htmlFor="directed" className="text-slate-300 text-sm">Directed Graph</label>
              </div>
            </div>
          </div>

          {/* BFS Controls */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={startVertex}
                  onChange={(e) => setStartVertex(e.target.value)}
                  placeholder="Start vertex for BFS"
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-emerald-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={startBFS}
                  disabled={!startVertex.trim() || animating || vertices.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {animating ? 'Running BFS...' : 'Start BFS'}
                </button>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={endVertex}
                  onChange={(e) => setEndVertex(e.target.value)}
                  placeholder="End vertex (optional)"
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-emerald-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={findPath}
                  disabled={!startVertex.trim() || !endVertex.trim() || animating}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Find Path
                </button>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
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
          </div>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Display */}
          <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Graph Visualization</h2>
            
            {vertices.length === 0 ? (
              <div className="text-center text-slate-400 py-16">
                Add vertices and edges to create a graph, then run BFS!
              </div>
            ) : (
              <div className="relative">
                <svg width="400" height="300" className="mx-auto border border-slate-600 rounded-lg bg-slate-900/50">
                  {/* Render Edges */}
                  {edges.map((edge, index) => {
                    const [v1, v2] = edge;
                    const v1Index = vertices.indexOf(v1);
                    const v2Index = vertices.indexOf(v2);
                    const pos1 = getVertexPosition(v1, v1Index);
                    const pos2 = getVertexPosition(v2, v2Index);
                    
                    const isTraversed = visitedVertices.has(v1) && visitedVertices.has(v2);
                    const isInPath = showPath && shortestPath.includes(v1) && shortestPath.includes(v2) &&
                                   Math.abs(shortestPath.indexOf(v1) - shortestPath.indexOf(v2)) === 1;
                    
                    return (
                      <line
                        key={index}
                        x1={pos1.x}
                        y1={pos1.y}
                        x2={pos2.x}
                        y2={pos2.y}
                        stroke={isInPath ? '#f59e0b' : isTraversed ? '#10b981' : '#64748b'}
                        strokeWidth={isInPath ? '4' : isTraversed ? '3' : '2'}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                  
                  {/* Render Vertices */}
                  {vertices.map((vertex, index) => {
                    const pos = getVertexPosition(vertex, index);
                    const isVisited = visitedVertices.has(vertex);
                    const isCurrent = currentVertex === vertex;
                    const isInPath = showPath && shortestPath.includes(vertex);
                    const level = levels[vertex] || 0;
                    
                    return (
                      <g key={vertex}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="20"
                          fill={isCurrent ? '#fbbf24' : isInPath ? '#f59e0b' : isVisited ? getLevelColor(level) : '#475569'}
                          stroke={isCurrent ? '#f59e0b' : isInPath ? '#d97706' : isVisited ? '#ffffff' : '#64748b'}
                          strokeWidth="2"
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
                        {/* Level indicator */}
                        {isVisited && levels[vertex] !== undefined && (
                          <text
                            x={pos.x + 25}
                            y={pos.y - 15}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            L{levels[vertex]}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
            
            {/* Current Level Info */}
            {animating && (
              <div className="text-center mt-4">
                <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-semibold">
                  Exploring Level {currentLevel}
                </span>
              </div>
            )}
          </div>

          {/* BFS Info Panel */}
          <div className="space-y-6">
            {/* Traversal Path */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">BFS Traversal Path</h3>
              <div className="flex flex-wrap gap-2">
                {traversalPath.map((vertex, index) => (
                  <span
                    key={index}
                    className={`
                      px-3 py-1 rounded text-sm font-bold
                      ${currentVertex === vertex 
                        ? 'bg-yellow-500 text-black' 
                        : `bg-emerald-500 text-white`
                      }
                    `}
                  >
                    {index + 1}. {vertex}
                  </span>
                ))}
              </div>
              {bfsComplete && (
                <div className="mt-3 text-emerald-400 font-semibold">
                  ✅ BFS Complete! Visited {traversalPath.length} vertices.
                </div>
              )}
            </div>

            {/* Current Queue State */}
            {queue.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-white font-bold mb-3">Queue State</h3>
                <div className="flex flex-wrap gap-2">
                  {queue.map((vertex, index) => (
                    <div
                      key={index}
                      className={`
                        px-3 py-2 rounded border-2
                        ${index === 0 
                          ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400' 
                          : 'bg-slate-700 border-slate-600 text-slate-300'
                        }
                      `}
                    >
                      {vertex} {index === 0 && '← Front'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shortest Path */}
            {showPath && shortestPath.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-white font-bold mb-3">Shortest Path</h3>
                <div className="flex flex-wrap gap-2">
                  {shortestPath.map((vertex, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-500 text-black rounded text-sm font-bold"
                    >
                      {vertex}
                      {index < shortestPath.length - 1 && ' →'}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-yellow-400 text-sm">
                  Distance: {shortestPath.length - 1} edges
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">Graph Statistics</h3>
              <div className="space-y-2 text-slate-300">
                <div>Vertices: <span className="text-emerald-400 font-bold">{vertices.length}</span></div>
                <div>Edges: <span className="text-green-400 font-bold">{edges.length}</span></div>
                <div>Visited: <span className="text-purple-400 font-bold">{visitedVertices.size}</span></div>
                <div>Max Level: <span className="text-yellow-400 font-bold">{Math.max(...Object.values(levels), 0)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4 text-center">Legend</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-600 rounded-full border-2 border-slate-500"></div>
              <span className="text-slate-300 text-sm">Unvisited Vertex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-400"></div>
              <span className="text-slate-300 text-sm">Current Vertex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              <span className="text-slate-300 text-sm">Visited Vertex (Level Color)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-yellow-500"></div>
              <span className="text-slate-300 text-sm">Shortest Path</span>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">BFS Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-emerald-400 font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O(V + E)</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(V)</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold mb-2">Data Structure</div>
              <div className="text-slate-300 text-sm">Queue</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">Shortest path, Level traversal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
