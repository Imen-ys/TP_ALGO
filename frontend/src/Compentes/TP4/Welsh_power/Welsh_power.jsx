import { useState, useEffect, useRef } from 'react';

const WelshPowell = () => {
  const [graph, setGraph] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState("checking");
  const canvasRef = useRef(null);

  // --- MODIFIED: Load graph from localStorage or fetch from server ---
  useEffect(() => {
    const loadGraph = async () => {
      try {
        // 1. First, try to get the graph from localStorage
        const savedGraph = localStorage.getItem('uploadedGraph');
        if (savedGraph) {
          const graphData = JSON.parse(savedGraph);
          console.log("Loading graph from localStorage:", graphData);
          setGraph(graphData);
          // Clear localStorage so it doesn't get used again on refresh
          localStorage.removeItem('uploadedGraph');
          setServerStatus("online"); // Assume server is online if we have a graph
          return;
        }

        // 2. If no graph in localStorage, check server status and fetch
        const response = await fetch("http://127.0.0.1:5000/");
        if (response.ok) {
          setServerStatus("online");
          fetchGraphData(); // Fetch the default graph from server
        } else {
          setServerStatus("offline");
          setError("Server is not responding correctly");
        }
      } catch (error) {
        setServerStatus("offline");
        setError("Cannot connect to server. Make sure the Flask server is running on port 5000.");
      }
    };
    
    loadGraph();
  }, []); // This runs only once when the component mounts

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://127.0.0.1:5000/welsh_powell/get");
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      console.log("Loading graph from server:", data.graph);
      setGraph(data.graph);
      setCurrentStepIndex(-1);
      setSteps([]);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const executeWelshPowell = async () => {
    if (!graph) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://127.0.0.1:5000/welsh_powell/execute");
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
     
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setSteps(data.steps);
      setCurrentStepIndex(0);

    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#FF5252', '#448AFF', '#69F0AE', '#FFD740', '#E040FB', '#40C4FF'];
  const colorNames = ['Rouge', 'Bleu', 'Jaune', 'Vert', 'Violet', 'Orange'];

  const drawGraph = (coloring = {}) => {
    if (!canvasRef.current || !graph) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const nodes = Object.keys(graph).sort();
    const nodePositions = {};
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      nodePositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    nodes.forEach(source => {
      if(!graph[source]) return;
      graph[source].forEach(target => {
        const start = nodePositions[source];
        const end = nodePositions[target];
        if (!start || !end) return;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });
    });

    nodes.forEach(node => {
      const pos = nodePositions[node];
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      
      if (coloring[node] !== undefined) {
        ctx.fillStyle = colors[coloring[node] % colors.length];
      } else {
        ctx.fillStyle = '#E0E0E0';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#2c5aad';
      ctx.lineWidth = 3;
      ctx.stroke();
     
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, pos.x, pos.y);
    });
  };

  // UPDATED: renderStepTable function
  const renderStepTable = (step) => {
    if (!step || !step.sorted_nodes) return null;

    const maxColors = Math.max(...Object.values(step.coloring), -1) + 1;

    return (
      <div className="mt-4 overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left font-semibold">Sommets</th>
              <th className="border border-gray-300 p-2 text-left font-semibold">Degré</th>
              {Array.from({ length: Math.max(4, maxColors) }, (_, i) => (
                <th key={i} className="border border-gray-300 p-2 text-center font-semibold">
                  C{i + 1} ({colorNames[i]})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {step.sorted_nodes.map(node => (
              <tr key={node} className={
                Array.isArray(step.last_colored) 
                  ? (step.last_colored.includes(node) ? 'bg-yellow-100' : '')
                  : (step.last_colored === node ? 'bg-yellow-100' : '')
              }>
                <td className="border border-gray-300 p-2 font-medium">{node}</td>
                <td className="border border-gray-300 p-2 text-center">{step.degrees[node]}</td>
                {Array.from({ length: Math.max(4, maxColors) }, (_, i) => (
                  <td key={i} className="border border-gray-300 p-2 text-center text-xl">
                    {step.coloring[node] === i ? '✓' : 'X'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    if (steps.length > 0 && currentStepIndex >= 0) {
      drawGraph(steps[currentStepIndex].coloring);
    } else {
      drawGraph({});
    }
  }, [graph, steps, currentStepIndex]);

  const currentStep = steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
          Welsh-Powell
        </h1>
       
       
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 flex gap-4 items-center justify-center">
            <button 
                onClick={fetchGraphData}
                disabled={loading || serverStatus !== "online"}
                className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition font-medium shadow-sm flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Refresh Graph
            </button>
            <button 
                onClick={executeWelshPowell}
                disabled={!graph || loading || serverStatus !== "online"}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium shadow-sm flex items-center gap-2"
            >
                Run Algorithm
            </button>
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        {steps.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-8 flex items-center justify-between">
                <button 
                    onClick={() => setCurrentStepIndex(i => Math.max(0, i - 1))}
                    disabled={currentStepIndex === 0}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="font-semibold">
                    Step {currentStepIndex + 1} of {steps.length}
                </span>
                <button 
                    onClick={() => setCurrentStepIndex(i => Math.min(steps.length - 1, i + 1))}
                    disabled={currentStepIndex === steps.length - 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                        Graph Visualization
                    </h2>
                    <div className="flex justify-center bg-gray-50 rounded border border-gray-200">
                         <canvas ref={canvasRef} width={450} height={450} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                        Execution Table
                    </h2>
                    {currentStep ? (
                        <>
                            <p className="text-sm text-gray-600 mb-3 italic">{currentStep.message}</p>
                            {renderStepTable(currentStep)}
                        </>
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <p>Run the algorithm to see the execution table.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WelshPowell;