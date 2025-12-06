import  { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
const Prim = () => {
  const [graph, setGraph] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchGraphData();
  }, []);
  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/graphePondere/get`);
      const data = await response.json();
      setGraph(data.graph);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setLoading(false);
    }
  };

  const executePrim = async () => {
    if (!graph) return alert("No graph available. Please upload a graph first.");
    
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/prim/execute`);
      const data = await response.json();
      setSteps(data.steps);
      setCurrentStep(0);
    } catch (error) {
      console.error("Error executing Prim's algorithm:", error);
      alert("Failed to execute Prim's algorithm");
    } finally {
      setLoading(false);
    }
  };

  const drawGraph = () => {
    if (!canvasRef.current || !graph) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const nodes = Object.keys(graph);
    const edges = [];
    
    for (const node in graph) {
      for (const [neighbor, weight] of graph[node]) {
        if (!edges.some(e => (e[0] === node && e[1] === neighbor) || (e[0] === neighbor && e[1] === node))) {
          edges.push([node, neighbor, weight]);
        }
      }
    }
    
    const nodePositions = {};
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      nodePositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    const currentStepData = steps[currentStep] || {};
    const visitedNodes = new Set(currentStepData.visited || []);
    const treeEdges = currentStepData.tree_edges || [];
    const currentEdge = currentStepData.edge || null;
    
    edges.forEach(([from, to, weight]) => {
      const fromPos = nodePositions[from];
      const toPos = nodePositions[to];
      
      const isInTree = treeEdges.some(e => 
        (e[0] === from && e[1] === to) || (e[0] === to && e[1] === from)
      );
      
      const isCurrentEdge = currentEdge && 
        ((currentEdge[0] === from && currentEdge[1] === to) || 
         (currentEdge[0] === to && currentEdge[1] === from));
      
      if (isInTree) {
        ctx.strokeStyle = '#4CAF50'; 
        ctx.lineWidth = 4;
      } else if (isCurrentEdge) {
        ctx.strokeStyle = '#FF9800';
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = '#d0d0d0'; 
        ctx.lineWidth = 2;
      }
      
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      ctx.stroke();
      
      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(weight.toString(), midX, midY);
    });
    
    nodes.forEach(node => {
      const pos = nodePositions[node];
      const isVisited = visitedNodes.has(node);
      
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = isVisited ? '#4CAF50' : '#f0f0f0';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = isVisited ? 'white' : '#333';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, pos.x, pos.y);
    });
  };

  const playAnimation = () => {
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500); 
  };

  const pauseAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    pauseAnimation();
    setCurrentStep(0);
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    drawGraph();
  }, [graph, currentStep, steps]);

  useEffect(() => {
    if (isPlaying) {
      playAnimation();
    } else {
      pauseAnimation();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length]);

  const formatTreeEdges = (edges) => {
    if (!edges || edges.length === 0) return "None";
    return edges.map(e => `${e[0]}-${e[1]}(${e[2]})`).join(", ");
  };

  const calculateCumulativeWeight = (stepIndex) => {
    if (stepIndex < 0 || !steps[stepIndex]) return 0;
    const step = steps[stepIndex];
    if (!step.tree_edges || step.tree_edges.length === 0) return 0;
    return step.tree_edges.reduce((sum, edge) => sum + edge[2], 0);
  };

  return (
    <>

      <div className="min-h-screen bg-green-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
            Prim
          </h1>
        <Link
          to="/tp4"
          className="mb-6 inline-block px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
        >
          &larr; Back to Algorithms
        </Link>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Algorithm Controls</h2>
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={executePrim}
                disabled={loading || !graph}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition-all duration-200 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Run Prim's Algorithm"}
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={steps.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={resetAnimation}
                disabled={steps.length === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 disabled:bg-gray-400"
              >
                Reset
              </button>
              <button
                onClick={stepBackward}
                disabled={currentStep === 0 || steps.length === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 disabled:bg-gray-400"
              >
                Step Back
              </button>
              <button
                onClick={stepForward}
                disabled={currentStep === steps.length - 1 || steps.length === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 disabled:bg-gray-400"
              >
                Step Forward
              </button>
            </div>
            
            {steps.length > 0 && (
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Current Step:</h3>
                <p className="text-gray-700">
                  {steps[currentStep]?.message || "No step selected"}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">Graph</h2>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={500}
                  className="border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

              
              {steps.length > 0 && steps[currentStep]?.type === "complete" && (
                <div className="mt-6 bg-green-100 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Algorithm Complete!</h3>
                  <p className="text-gray-700">
                    Total weight of minimum spanning tree: {steps[currentStep]?.total_weight}
                  </p>
                  <div className="mt-2">
                    <h4 className="font-medium">Edges in MST:</h4>
                    <ul className="list-disc list-inside">
                      {steps[currentStep]?.tree_edges?.map((edge, index) => (
                        <li key={index}>
                          {edge[0]} - {edge[1]} (weight: {edge[2]})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

    </>
  );
};

export default Prim;