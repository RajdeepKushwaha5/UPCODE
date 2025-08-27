'use client';
import { useState } from 'react';

class UnionFind {
  constructor(vertices) {
    this.parent = {};
    this.rank = {};
    
    vertices.forEach(vertex => {
      this.parent[vertex] = vertex;
      this.rank[vertex] = 0;
    });
  }

  find(vertex) {
    if (this.parent[vertex] !== vertex) {
      this.parent[vertex] = this.find(this.parent[vertex]); // Path compression
    }
    return this.parent[vertex];
  }

  union(vertex1, vertex2) {
    const root1 = this.find(vertex1);
    const root2 = this.find(vertex2);

    if (root1 === root2) return false;

    // Union by rank
    if (this.rank[root1] < this.rank[root2]) {
      this.parent[root1] = root2;
    } else if (this.rank[root1] > this.rank[root2]) {
      this.parent[root2] = root1;
    } else {
      this.parent[root2] = root1;
      this.rank[root1]++;
    }
    return true;
  }

  connected(vertex1, vertex2) {
    return this.find(vertex1) === this.find(vertex2);
  }
}

class WeightedGraph {
  constructor() {
    this.vertices = new Set();
    this.edges = [];
  }

  addVertex(vertex) {
    this.vertices.add(vertex);
  }

  addEdge(vertex1, vertex2, weight) {
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    this.edges.push([vertex1, vertex2, weight]);
  }

  getVertices() {
    return Array.from(this.vertices);
  }

  getEdges() {
    return this.edges;
  }

  async kruskalMST(callback) {
    const mst = [];
    const sortedEdges = [...this.edges].sort((a, b) => a[2] - b[2]);
    const uf = new UnionFind(this.getVertices());
    let totalWeight = 0;

    for (let i = 0; i < sortedEdges.length; i++) {
      const [vertex1, vertex2, weight] = sortedEdges[i];
      
      await callback('considering', [vertex1, vertex2, weight], [...mst], totalWeight, {
        currentEdge: i,
        totalEdges: sortedEdges.length,
        sortedEdges: sortedEdges
      });

      if (uf.union(vertex1, vertex2)) {
        mst.push([vertex1, vertex2, weight]);
        totalWeight += weight;
        
        await callback('accepted', [vertex1, vertex2, weight], [...mst], totalWeight, {
          currentEdge: i,
          totalEdges: sortedEdges.length,
          sortedEdges: sortedEdges
        });
      } else {
        await callback('rejected', [vertex1, vertex2, weight], [...mst], totalWeight, {
          currentEdge: i,
          totalEdges: sortedEdges.length,
          sortedEdges: sortedEdges
        });
      }

      if (mst.length === this.vertices.size - 1) break;
    }

    return { mst, totalWeight };
  }
}

export default function KruskalAlgorithmVisualization() {
  const [graph, setGraph] = useState(new WeightedGraph());
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputVertex, setInputVertex] = useState('');
  const [inputEdge1, setInputEdge1] = useState('');
  const [inputEdge2, setInputEdge2] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [animating, setAnimating] = useState(false);
  const [currentEdge, setCurrentEdge] = useState(null);
  const [mstEdges, setMstEdges] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [algorithmComplete, setAlgorithmComplete] = useState(false);
  const [sortedEdges, setSortedEdges] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [edgeStatus, setEdgeStatus] = useState(''); // 'considering', 'accepted', 'rejected'

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

  const startKruskal = async () => {
    if (animating || vertices.length < 2) return;

    setAnimating(true);
    setAlgorithmComplete(false);
    setMstEdges([]);
    setTotalWeight(0);
    setCurrentEdge(null);
    setCurrentStep(0);
    setEdgeStatus('');

    const animationCallback = async (status, edge, mst, weight, stepInfo) => {
      setEdgeStatus(status);
      setCurrentEdge(edge);
      setMstEdges([...mst]);
      setTotalWeight(weight);
      setCurrentStep(stepInfo.currentEdge);
      setSortedEdges(stepInfo.sortedEdges);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    };

    await graph.kruskalMST(animationCallback);
    
    setCurrentEdge(null);
    setEdgeStatus('');
    setAlgorithmComplete(true);
    setAnimating(false);
  };

  const clearGraph = () => {
    if (!animating) {
      setGraph(new WeightedGraph());
      setVertices([]);
      setEdges([]);
      setMstEdges([]);
      setTotalWeight(0);
      setCurrentEdge(null);
      setAlgorithmComplete(false);
      setSortedEdges([]);
      setCurrentStep(0);
      setEdgeStatus('');
    }
  };

  const createSampleGraph = () => {
    if (!animating) {
      const newGraph = new WeightedGraph();
      newGraph.addEdge('A', 'B', 4);
      newGraph.addEdge('A', 'H', 8);
      newGraph.addEdge('B', 'C', 8);
      newGraph.addEdge('B', 'H', 11);
      newGraph.addEdge('C', 'D', 7);
      newGraph.addEdge('C', 'F', 4);
      newGraph.addEdge('C', 'I', 2);
      newGraph.addEdge('D', 'E', 9);
      newGraph.addEdge('D', 'F', 14);
      newGraph.addEdge('E', 'F', 10);
      newGraph.addEdge('F', 'G', 2);
      newGraph.addEdge('G', 'H', 1);
      newGraph.addEdge('G', 'I', 6);
      newGraph.addEdge('H', 'I', 7);
      
      setGraph(newGraph);
      setVertices(newGraph.getVertices());
      setEdges(newGraph.getEdges());
      setMstEdges([]);
      setTotalWeight(0);
      setCurrentEdge(null);
      setAlgorithmComplete(false);
      setSortedEdges([]);
      setCurrentStep(0);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Kruskal's Algorithm Visualization
          </h1>
          <p className="text-slate-300 text-lg">
            Find Minimum Spanning Tree by sorting edges and using Union-Find data structure
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-green-400 focus:outline-none"
                  disabled={animating}
                />
                <button
                  onClick={addVertex}
                  disabled={!inputVertex.trim() || animating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
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
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-green-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="text"
                  value={inputEdge2}
                  onChange={(e) => setInputEdge2(e.target.value)}
                  placeholder="To"
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-green-400 focus:outline-none"
                  disabled={animating}
                />
                <input
                  type="number"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder="Weight"
                  min="1"
                  className="w-20 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-green-400 focus:outline-none"
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
            <div className="flex justify-center gap-4">
              <button
                onClick={startKruskal}
                disabled={animating || vertices.length < 2}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {animating ? 'Running Kruskal...' : 'Start Kruskal\'s MST'}
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
          </div>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Display */}
          <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Minimum Spanning Tree</h2>
            
            {vertices.length === 0 ? (
              <div className="text-center text-slate-400 py-16">
                Add vertices and weighted edges to create a graph, then run Kruskal's algorithm!
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
                      if (edgeStatus === 'considering') {
                        edgeColor = '#fbbf24';
                        strokeWidth = 4;
                      } else if (edgeStatus === 'accepted') {
                        edgeColor = '#10b981';
                        strokeWidth = 4;
                      } else if (edgeStatus === 'rejected') {
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
                    
                    return (
                      <g key={vertex}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="20"
                          fill="#10b981"
                          stroke="#059669"
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
                      ${edgeStatus === 'considering' ? 'bg-yellow-500/20 text-yellow-400' :
                        edgeStatus === 'accepted' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'}
                    `}>
                      {edgeStatus === 'considering' && 'Considering edge'} 
                      {edgeStatus === 'accepted' && 'Edge accepted - Added to MST'} 
                      {edgeStatus === 'rejected' && 'Edge rejected - Would create cycle'}
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
            {/* Sorted Edges */}
            {sortedEdges.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-white font-bold mb-3">Sorted Edges (by weight)</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sortedEdges.map((edge, index) => {
                    const [v1, v2, weight] = edge;
                    const inMST = isEdgeInMST(v1, v2);
                    const isCurrent = isCurrentEdge(v1, v2);
                    
                    return (
                      <div
                        key={index}
                        className={`
                          flex justify-between items-center px-3 py-2 rounded text-sm
                          ${isCurrent && edgeStatus === 'considering' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400' :
                            isCurrent && edgeStatus === 'accepted' ? 'bg-green-500/20 text-green-400 border border-green-400' :
                            isCurrent && edgeStatus === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-400' :
                            inMST ? 'bg-green-500/20 text-green-400' :
                            index < currentStep ? 'bg-slate-600 text-slate-400' :
                            'bg-slate-700 text-slate-300'}
                        `}
                      >
                        <span className="font-mono">{v1}-{v2}</span>
                        <span className="font-bold">{weight}</span>
                      </div>
                    );
                  })}
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

            {/* Statistics */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-3">Algorithm Status</h3>
              <div className="space-y-2 text-slate-300">
                <div>Vertices: <span className="text-green-400 font-bold">{vertices.length}</span></div>
                <div>Total Edges: <span className="text-blue-400 font-bold">{edges.length}</span></div>
                <div>MST Edges: <span className="text-purple-400 font-bold">{mstEdges.length}</span></div>
                <div>Total Weight: <span className="text-yellow-400 font-bold">{totalWeight}</span></div>
                <div>Progress: <span className="text-amber-400 font-bold">
                  {sortedEdges.length > 0 ? `${currentStep + 1}/${sortedEdges.length}` : '0/0'}
                </span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4 text-center">Legend</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-500"></div>
              <span className="text-slate-300 text-sm">Original Edge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-yellow-500"></div>
              <span className="text-slate-300 text-sm">Considering Edge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-green-500"></div>
              <span className="text-slate-300 text-sm">MST Edge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-red-500"></div>
              <span className="text-slate-300 text-sm">Rejected Edge</span>
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">Kruskal's Algorithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Time Complexity</div>
              <div className="text-slate-300 text-sm">O(E log E)</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold mb-2">Space Complexity</div>
              <div className="text-slate-300 text-sm">O(V)</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold mb-2">Data Structure</div>
              <div className="text-slate-300 text-sm">Union-Find</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold mb-2">Use Cases</div>
              <div className="text-slate-300 text-sm">Network design, Clustering</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
