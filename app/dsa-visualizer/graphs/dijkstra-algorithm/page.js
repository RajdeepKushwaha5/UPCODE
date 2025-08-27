'use client';
import { useState } from 'react';

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  getItems() {
    return this.items.map(item => `${item.element}(${item.priority})`);
  }
}

class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, weight) {
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  getVertices() {
    return Object.keys(this.adjacencyList);
  }

  getEdges() {
    const edges = [];
    for (let vertex in this.adjacencyList) {
      for (let edge of this.adjacencyList[vertex]) {
        // Avoid duplicate edges for undirected graph
        if (vertex < edge.node) {
          edges.push([vertex, edge.node, edge.weight]);
        }
      }
    }
    return edges;
  }

  async dijkstra(startVertex, callback) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    const visited = new Set();

    // Initialize distances
    for (let vertex in this.adjacencyList) {
      distances[vertex] = vertex === startVertex ? 0 : Infinity;
      previous[vertex] = null;
    }

    pq.enqueue(startVertex, 0);

    while (!pq.isEmpty()) {
      const { element: currentVertex, priority: currentDistance } = pq.dequeue();

      if (visited.has(currentVertex)) continue;
      visited.add(currentVertex);

      // Call callback for animation
      await callback(currentVertex, { ...distances }, { ...previous }, [...visited], pq.getItems());

      // Update distances to neighbors
      for (let neighbor of this.adjacencyList[currentVertex] || []) {
        const { node, weight } = neighbor;
        const distance = currentDistance + weight;

        if (distance < distances[node]) {
          distances[node] = distance;
          previous[node] = currentVertex;
          pq.enqueue(node, distance);
        }
      }
    }

    return { distances, previous };
  }

  getShortestPath(previous, start, end) {
    const path = [];
    let current = end;

    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    return path[0] === start ? path : [];
  }
}

export default function DijkstraAlgorithmVisualization() {
  const [graph, setGraph] = useState(new WeightedGraph());
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputVertex, setInputVertex] = useState('');
  const [inputEdge1, setInputEdge1] = useState('');
  const [inputEdge2, setInputEdge2] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [startVertex, setStartVertex] = useState('');
  const [endVertex, setEndVertex] = useState('');
  const [animating, setAnimating] = useState(false);
  const [currentVertex, setCurrentVertex] = useState(null);
  const [distances, setDistances] = useState({});
  const [previous, setPrevious] = useState({});
  const [visited, setVisited] = useState(new Set());
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);
  const [showPath, setShowPath] = useState(false);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);

  const addVertex = () => {
    if (inputVertex.trim() && !animating) {
      graph.addVertex(inputVertex.toUpperCase());
      setVertices(graph.getVertices());
      setEdges(graph.getEdges());
      setInputVertex('');
    }
  };

  const addEdge = () => {
    if (inputEdge1.trim() && inputEdge2.trim() && inputWeight.trim() && !animating) {
      const v1 = inputEdge1.toUpperCase();
      const v2 = inputEdge2.toUpperCase();
      const weight = parseInt(inputWeight);
      if (weight > 0) {
        graph.addEdge(v1, v2, weight);
        setVertices(graph.getVertices());
        setEdges(graph.getEdges());
        setInputEdge1('');
        setInputEdge2('');
        setInputWeight('');
      }
    }
  };

  const startDijkstra = async () => {
    if (!startVertex.trim() || animating) return;
    
    const start = startVertex.toUpperCase();
    if (!graph.adjacencyList[start]) {
      alert('Start vertex not found in graph!');
      return;
    }

    setAnimating(true);
    setAlgorithmComplete(false);
    setDistances({});
    setPrevious({});
    setVisited(new Set());
    setCurrentVertex(null);
    setPriorityQueue([]);
    setShortestPath([]);
    setShowPath(false);

    const animationCallback = async (vertex, dist, prev, vis, pq) => {
      setCurrentVertex(vertex);
      setDistances(dist);
      setPrevious(prev);
      setVisited(new Set(vis));
      setPriorityQueue([...pq]);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    };

    const result = await graph.dijkstra(start, animationCallback);
    
    setCurrentVertex(null);
    setPriorityQueue([]);
    setAlgorithmComplete(true);
    setAnimating(false);
  };

  const findShortestPath = () => {
    if (!startVertex.trim() || !endVertex.trim() || !algorithmComplete) return;
    
    const start = startVertex.toUpperCase();
    const end = endVertex.toUpperCase();
    const path = graph.getShortestPath(previous, start, end);
    
    if (path.length > 0) {
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
      setGraph(new WeightedGraph());
      setVertices([]);
      setEdges([]);
      setDistances({});
      setPrevious({});
      setVisited(new Set());
      setCurrentVertex(null);
      setAlgorithmComplete(false);
      setPriorityQueue([]);
      setShortestPath([]);
      setShowPath(false);
    }
  };

  const createSampleGraph = () => {
    if (!animating) {
      const newGraph = new WeightedGraph();
      newGraph.addEdge('A', 'B', 4);
      newGraph.addEdge('A', 'C', 2);
      newGraph.addEdge('B', 'C', 1);
      newGraph.addEdge('B', 'D', 5);
      newGraph.addEdge('C', 'D', 8);
      newGraph.addEdge('C', 'E', 10);
      newGraph.addEdge('D', 'E', 2);
      
      setGraph(newGraph);
      setVertices(newGraph.getVertices());
      setEdges(newGraph.getEdges());
      setDistances({});
      setPrevious({});
      setVisited(new Set());
      setCurrentVertex(null);
      setAlgorithmComplete(false);
      setPriorityQueue([]);
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

  const getEdgeWeight = (v1, v2) => {
    const edge = edges.find(([vertex1, vertex2]) => 
      (vertex1 === v1 && vertex2 === v2) || (vertex1 === v2 && vertex2 === v1)
    );
    return edge ? edge[2] : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Dijkstra's Algorithm Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Find shortest paths from a source vertex to all other vertices in a weighted graph
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-amber-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addVertex}
                  disabled={!inputVertex.trim() || animating}
                  className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Add Weighted Edge */}
            <div>
              <h3 className="text-white font-bold mb-3">Add Weighted Edge</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputEdge1}
                  onChange={(e) => setInputEdge1(e.target.value)}
                  placeholder="From"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-amber-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="text"
                  value={inputEdge2}
                  onChange={(e) => setInputEdge2(e.target.value)}
                  placeholder="To"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-amber-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="number"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder="Weight"
                  min="1"
                  className="w-20 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-amber-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addEdge}
                  disabled={!inputEdge1.trim() || !inputEdge2.trim() || !inputWeight.trim() || animating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Algorithm Controls */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={startVertex}
                  onChange={(e) => setStartVertex(e.target.value)}
                  placeholder="Start vertex"
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-amber-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={startDijkstra}
                  disabled={!startVertex.trim() || animating || vertices.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {animating ? 'Running...' : 'Start Dijkstra'}
                </button>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={endVertex}
                  onChange={(e) => setEndVertex(e.target.value)}
                  placeholder="End vertex"
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-amber-400 focus:outline-none"
                  disabled={animating || !algorithmComplete}
                />
                <button
                  onClick={findShortestPath}
                  disabled={!startVertex.trim() || !endVertex.trim() || animating || !algorithmComplete}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Show Path
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
            <h2 className="text-xl font-bold text-white mb-4 text-center">Weighted Graph Visualization</h2>
            
            {vertices.length === 0 ? (
              <div className="text-center text-slate-400 py-16">
                Add vertices and weighted edges, then run Dijkstra's algorithm!
              </div>
            ) : (
              <div className="relative">
                <svg width="400" height="300" className="mx-auto border border-slate-600 rounded-lg bg-slate-900/50">
                  {/* Render Edges */}
                  {edges.map((edge, index) => {
                    const [v1, v2, weight] = edge;
                    const v1Index = vertices.indexOf(v1);
                    const v2Index = vertices.indexOf(v2);
                    const pos1 = getVertexPosition(v1, v1Index);
                    const pos2 = getVertexPosition(v2, v2Index);
                    
                    const midX = (pos1.x + pos2.x) / 2;
                    const midY = (pos1.y + pos2.y) / 2;
                    
                    const isInPath = showPath && shortestPath.includes(v1) && shortestPath.includes(v2) &&
                                   Math.abs(shortestPath.indexOf(v1) - shortestPath.indexOf(v2)) === 1;
                    
                    return (
                      <g key={index}>
                        <line
                          x1={pos1.x}
                          y1={pos1.y}
                          x2={pos2.x}
                          y2={pos2.y}
                          stroke={isInPath ? '#f59e0b' : '#64748b'}
                          strokeWidth={isInPath ? '4' : '2'}
                          className="transition-all duration-500"
                        />
                        {/* Weight label */}
                        <circle cx={midX} cy={midY} r="12" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                        <text
                          x={midX}
                          y={midY}
                          textAnchor="middle"
                          dy="0.35em"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {weight}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Render Vertices */}
                  {vertices.map((vertex, index) => {
                    const pos = getVertexPosition(vertex, index);
                    const isVisited = visited.has(vertex);
                    const isCurrent = currentVertex === vertex;
                    const isInPath = showPath && shortestPath.includes(vertex);
                    const distance = distances[vertex];
                    
                    return (
                      <g key={vertex}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="20"
                          fill={isCurrent ? '#fbbf24' : isInPath ? '#f59e0b' : isVisited ? '#10b981' : '#475569'}
                          stroke={isCurrent ? '#f59e0b' : isInPath ? '#d97706' : isVisited ? '#059669' : '#64748b'}
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
                        {/* Distance label */}
                        {distance !== undefined && distance !== Infinity && (
                          <text
                            x={pos.x}
                            y={pos.y + 35}
                            textAnchor="middle"
                            fill="#fbbf24"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            d: {distance}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          {/* Algorithm Info Panel */}
          <div className="space-y-6">
            {/* Distance Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">Distances from {startVertex}</h3>
              <div className="space-y-2">
                {Object.entries(distances).map(([vertex, distance]) => (
                  <div
                    key={vertex}
                    className={`
                      flex justify-between items-center px-3 py-2 rounded
                      ${currentVertex === vertex 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : visited.has(vertex)
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-700 text-slate-300'
                      }
                    `}
                  >
                    <span className="font-bold">{vertex}</span>
                    <span className="font-mono">
                      {distance === Infinity ? '∞' : distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Queue */}
            {priorityQueue.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-white font-bold mb-3">Priority Queue</h3>
                <div className="space-y-2">
                  {priorityQueue.map((item, index) => (
                    <div
                      key={index}
                      className={`
                        px-3 py-2 rounded border-2 text-sm
                        ${index === 0 
                          ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400' 
                          : 'bg-slate-700 border-slate-600 text-slate-300'
                        }
                      `}
                    >
                      {item} {index === 0 && '← Next'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shortest Path */}
            {showPath && shortestPath.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-white font-bold mb-3">Shortest Path</h3>
                <div className="flex flex-wrap gap-2 mb-3">
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
                <div className="text-yellow-400 text-sm">
                  Total Distance: {distances[endVertex.toUpperCase()] || 0}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">Algorithm Status</h3>
              <div className="space-y-2 text-slate-300">
                <div>Vertices: <span className="text-amber-400 font-bold">{vertices.length}</span></div>
                <div>Edges: <span className="text-green-400 font-bold">{edges.length}</span></div>
                <div>Processed: <span className="text-purple-400 font-bold">{visited.size}</span></div>
                <div>Complete: <span className="text-blue-400 font-bold">{algorithmComplete ? 'Yes' : 'No'}</span></div>
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
              <span className="text-slate-300 text-sm">Unprocessed Vertex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-400"></div>
              <span className="text-slate-300 text-sm">Current Vertex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-400"></div>
              <span className="text-slate-300 text-sm">Processed Vertex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-yellow-500"></div>
              <span className="text-slate-300 text-sm">Shortest Path</span>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">Dijkstra's Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-amber-400 font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O((V + E) log V)</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(V)</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold mb-2">Edge Weights</div>
              <div className="text-slate-300 text-sm">Non-negative</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">GPS navigation, Network routing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
