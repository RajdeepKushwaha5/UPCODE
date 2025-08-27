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

  async primMST(startVertex, callback) {
    const visited = new Set();
    const mstEdges = [];
    const pq = new PriorityQueue();
    let totalWeight = 0;

    // Start with the given vertex
    visited.add(startVertex);
    
    // Add all edges from start vertex to priority queue
    for (let edge of this.adjacencyList[startVertex] || []) {
      pq.enqueue(`${startVertex}-${edge.node}`, edge.weight);
    }

    await callback('started', null, [...mstEdges], totalWeight, [...visited], pq.getItems());

    while (!pq.isEmpty() && visited.size < this.getVertices().length) {
      const { element: edgeStr, priority: weight } = pq.dequeue();
      const [vertex1, vertex2] = edgeStr.split('-');

      // Skip if both vertices are already visited
      if (visited.has(vertex1) && visited.has(vertex2)) {
        await callback('skipped', [vertex1, vertex2, weight], [...mstEdges], totalWeight, [...visited], pq.getItems());
        continue;
      }

      // Add edge to MST
      mstEdges.push([vertex1, vertex2, weight]);
      totalWeight += weight;

      // Add the new vertex to visited set
      const newVertex = visited.has(vertex1) ? vertex2 : vertex1;
      visited.add(newVertex);

      await callback('accepted', [vertex1, vertex2, weight], [...mstEdges], totalWeight, [...visited], pq.getItems());

      // Add all edges from the new vertex to unvisited vertices
      for (let edge of this.adjacencyList[newVertex] || []) {
        if (!visited.has(edge.node)) {
          pq.enqueue(`${newVertex}-${edge.node}`, edge.weight);
        }
      }
    }

    return { mstEdges, totalWeight };
  }
}

export default function PrimAlgorithmVisualization() {
  const [graph, setGraph] = useState(new WeightedGraph());
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputVertex, setInputVertex] = useState('');
  const [inputEdge1, setInputEdge1] = useState('');
  const [inputEdge2, setInputEdge2] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [startVertex, setStartVertex] = useState('');
  const [animating, setAnimating] = useState(false);
  const [currentEdge, setCurrentEdge] = useState(null);
  const [mstEdges, setMstEdges] = useState([]);
  const [visitedVertices, setVisitedVertices] = useState(new Set());
  const [totalWeight, setTotalWeight] = useState(0);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [edgeStatus, setEdgeStatus] = useState(''); // 'started', 'accepted', 'skipped'

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

  const startPrim = async () => {
    if (!startVertex.trim() || animating || vertices.length < 2) return;
    
    const start = startVertex.toUpperCase();
    if (!graph.adjacencyList[start]) {
      alert('Start vertex not found in graph!');
      return;
    }

    setAnimating(true);
    setAlgorithmComplete(false);
    setMstEdges([]);
    setVisitedVertices(new Set());
    setTotalWeight(0);
    setCurrentEdge(null);
    setEdgeStatus('');
    setPriorityQueue([]);

    const animationCallback = async (status, edge, mst, weight, visited, pq) => {
      setEdgeStatus(status);
      setCurrentEdge(edge);
      setMstEdges([...mst]);
      setVisitedVertices(new Set(visited));
      setTotalWeight(weight);
      setPriorityQueue([...pq]);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    };

    await graph.primMST(start, animationCallback);
    
    setCurrentEdge(null);
    setEdgeStatus('');
    setPriorityQueue([]);
    setAlgorithmComplete(true);
    setAnimating(false);
  };

  const clearGraph = () => {
    if (!animating) {
      setGraph(new WeightedGraph());
      setVertices([]);
      setEdges([]);
      setMstEdges([]);
      setVisitedVertices(new Set());
      setTotalWeight(0);
      setCurrentEdge(null);
      setAlgorithmComplete(false);
      setPriorityQueue([]);
      setEdgeStatus('');
    }
  };

  const createSampleGraph = () => {
    if (!animating) {
      const newGraph = new WeightedGraph();
      newGraph.addEdge('A', 'B', 2);
      newGraph.addEdge('A', 'C', 3);
      newGraph.addEdge('B', 'C', 1);
      newGraph.addEdge('B', 'D', 1);
      newGraph.addEdge('B', 'E', 4);
      newGraph.addEdge('C', 'F', 5);
      newGraph.addEdge('D', 'E', 1);
      newGraph.addEdge('E', 'F', 1);
      
      setGraph(newGraph);
      setVertices(newGraph.getVertices());
      setEdges(newGraph.getEdges());
      setMstEdges([]);
      setVisitedVertices(new Set());
      setTotalWeight(0);
      setCurrentEdge(null);
      setAlgorithmComplete(false);
      setPriorityQueue([]);
      setEdgeStatus('');
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

  const isEdgeInMST = (v1, v2) => {
    return mstEdges.some(([e1, e2]) => 
      (e1 === v1 && e2 === v2) || (e1 === v2 && e2 === v1)
    );
  };

  const isCurrentEdge = (v1, v2) => {
    if (!currentEdge) return false;
    const [c1, c2] = currentEdge;
    return (c1 === v1 && c2 === v2) || (c1 === v2 && c2 === v1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Prim's Algorithm Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Find Minimum Spanning Tree by growing the tree one vertex at a time using a priority queue
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addVertex}
                  disabled={!inputVertex.trim() || animating}
                  className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50 transition-colors"
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="text"
                  value={inputEdge2}
                  onChange={(e) => setInputEdge2(e.target.value)}
                  placeholder="To"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="number"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder="Weight"
                  min="1"
                  className="w-20 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addEdge}
                  disabled={!inputEdge1.trim() || !inputEdge2.trim() || !inputWeight.trim() || animating}
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
              <input
                type="text"
                value={startVertex}
                onChange={(e) => setStartVertex(e.target.value)}
                placeholder="Start vertex"
                className="px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-teal-400 focus:outline-none"
                disabled={animating}
              />
              <button
                onClick={startPrim}
                disabled={!startVertex.trim() || animating || vertices.length < 2}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {animating ? 'Running Prim...' : 'Start Prim\'s MST'}
              </button>
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
            <h2 className="text-xl font-bold text-white mb-4 text-center">Minimum Spanning Tree (Prim's)</h2>
            
            {vertices.length === 0 ? (
              <div className="text-center text-slate-400 py-16">
                Add vertices and weighted edges, then run Prim's algorithm!
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
                    
                    const inMST = isEdgeInMST(v1, v2);
                    const isCurrent = isCurrentEdge(v1, v2);
                    
                    let edgeColor = '#64748b';
                    let strokeWidth = 2;
                    
                    if (isCurrent) {
                      if (edgeStatus === 'accepted') {
                        edgeColor = '#10b981';
                        strokeWidth = 4;
                      } else if (edgeStatus === 'skipped') {
                        edgeColor = '#ef4444';
                        strokeWidth = 3;
                      }
                    } else if (inMST) {
                      edgeColor = '#10b981';
                      strokeWidth = 4;
                    }
                    
                    return (
                      <g key={index}>
                        <line
                          x1={pos1.x}
                          y1={pos1.y}
                          x2={pos2.x}
                          y2={pos2.y}
                          stroke={edgeColor}
                          strokeWidth={strokeWidth}
                          className="transition-all duration-500"
                        />
                        {/* Weight label */}
                        <circle cx={midX} cy={midY} r="12" fill="#1e293b" stroke={edgeColor} strokeWidth="1" />
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
                    const isVisited = visitedVertices.has(vertex);
                    
                    return (
                      <g key={vertex}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="20"
                          fill={isVisited ? '#10b981' : '#475569'}
                          stroke={isVisited ? '#059669' : '#64748b'}
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
                
                {/* Current Status */}
                {animating && currentEdge && (
                  <div className="text-center mt-4">
                    <div className={`
                      inline-block px-4 py-2 rounded-lg font-semibold
                      ${edgeStatus === 'accepted' ? 'bg-green-500/20 text-green-400' :
                        edgeStatus === 'skipped' ? 'bg-red-500/20 text-red-400' :
                        'bg-teal-500/20 text-teal-400'}
                    `}>
                      {edgeStatus === 'accepted' && 'Edge added to MST'} 
                      {edgeStatus === 'skipped' && 'Edge skipped - both vertices already in MST'} 
                      {edgeStatus === 'started' && 'Starting from vertex'}
                      <span className="ml-2 font-bold">
                        {currentEdge[0]}-{currentEdge[1]} (weight: {currentEdge[2]})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Algorithm Info Panel */}
          <div className="space-y-6">
            {/* Priority Queue */}
            {priorityQueue.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-white font-bold mb-3">Priority Queue</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {priorityQueue.map((item, index) => (
                    <div
                      key={index}
                      className={`
                        px-3 py-2 rounded text-sm border-2
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

            {/* MST Edges */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">MST Edges</h3>
              {mstEdges.length === 0 ? (
                <div className="text-slate-400 text-sm">No edges in MST yet</div>
              ) : (
                <div className="space-y-2">
                  {mstEdges.map((edge, index) => {
                    const [v1, v2, weight] = edge;
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center px-3 py-2 bg-green-500/20 text-green-400 rounded"
                      >
                        <span className="font-mono">{v1}-{v2}</span>
                        <span className="font-bold">{weight}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {algorithmComplete && (
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">MST Complete!</div>
                    <div className="text-slate-300 text-sm mt-1">
                      Total Weight: <span className="text-green-400 font-bold">{totalWeight}</span>
                    </div>
                    <div className="text-slate-300 text-sm">
                      Edges: <span className="text-green-400 font-bold">{mstEdges.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Visited Vertices */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">Visited Vertices</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(visitedVertices).map((vertex, index) => (
                  <span
                    key={vertex}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded font-bold"
                  >
                    {index + 1}. {vertex}
                  </span>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">Algorithm Status</h3>
              <div className="space-y-2 text-slate-300">
                <div>Vertices: <span className="text-teal-400 font-bold">{vertices.length}</span></div>
                <div>Total Edges: <span className="text-blue-400 font-bold">{edges.length}</span></div>
                <div>Visited: <span className="text-green-400 font-bold">{visitedVertices.size}</span></div>
                <div>MST Edges: <span className="text-purple-400 font-bold">{mstEdges.length}</span></div>
                <div>Total Weight: <span className="text-yellow-400 font-bold">{totalWeight}</span></div>
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
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-400"></div>
              <span className="text-slate-300 text-sm">Visited Vertex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-500"></div>
              <span className="text-slate-300 text-sm">Original Edge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-green-500"></div>
              <span className="text-slate-300 text-sm">MST Edge</span>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">Prim's Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-teal-400 font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O(E log V)</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(V)</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold mb-2">Data Structure</div>
              <div className="text-slate-300 text-sm">Priority Queue</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">Network design, Approximation algorithms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
