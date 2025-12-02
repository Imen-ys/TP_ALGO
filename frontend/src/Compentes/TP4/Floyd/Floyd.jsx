import { useState, useEffect, useRef } from 'react';

const Floyd = () => {
  const [graph, setGraph] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finalPathMatrix, setFinalPathMatrix] = useState(null); 
  const canvasRef = useRef(null);

  // --- 1. DATA FETCHING & EXECUTION ---

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5000/floyd/get");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGraph(data.graph);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeFloyd = async () => {
    if (!graph) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://127.0.0.1:5000/floyd/execute");
      const data = await response.json();
     
      if (data.error) throw new Error(data.error);

      // Helper to handle Infinity/None from JSON
      const deserializeMatrix = (matrix) => {
        if (!matrix) return null;
        return matrix.map(row => row.map(cell => (cell === null ? Infinity : cell)));
      };

      // Process steps including the final result
      const processedSteps = data.steps.map(step => ({
        ...step,
        distance_matrix: deserializeMatrix(step.distance_matrix),
        path_matrix: step.path_matrix,
      }));

      // Append the Final Result as a specific step for display
      const finalResult = {
        type: 'final',
        message: "Final Result (All Shortest Paths)",
        distance_matrix: deserializeMatrix(data.final_distance_matrix),
        path_matrix: data.final_path_matrix
      };

      setSteps([...processedSteps, finalResult]);
      // Store the final path matrix but don't trigger visualization change
      setFinalPathMatrix(data.final_path_matrix);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. PATH RECONSTRUCTION LOGIC ---

  const reconstructPath = (startIndex, endIndex, pathMatrix, nodes) => {
    if (pathMatrix[startIndex][endIndex] === null) return "No Path";
   
    let path = [nodes[endIndex]];
    let curr = endIndex;
   
    while (curr !== startIndex) {
      curr = pathMatrix[startIndex][curr];
      if (curr === null || curr === undefined) return "Error in path trace"; 
      path.push(nodes[curr]);
    }
   
    return path.reverse().join(" ➝ ");
  };

  const getAllPaths = (distMatrix, pathMatrix) => {
    if (!graph || !distMatrix || !pathMatrix) return [];
    const nodes = Object.keys(graph).sort();
    const paths = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          const distance = distMatrix[i][j];
          if (distance !== Infinity) {
             const pathStr = reconstructPath(i, j, pathMatrix, nodes);
             paths.push({
               from: nodes[i],
               to: nodes[j],
               cost: distance,
               path: pathStr
             });
          }
        }
      }
    }
    return paths;
  };

  // --- 3. CANVAS DRAWING HELPERS ---

  function drawArrowHead(ctx, x, y, angle, nodeRadius = 22) {
      const headlen = 10;
      const px = x - nodeRadius * Math.cos(angle);
      const py = y - nodeRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - headlen * Math.cos(angle - Math.PI / 6), py - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(px - headlen * Math.cos(angle + Math.PI / 6), py - headlen * Math.sin(angle + Math.PI / 6));
      ctx.fill();
  }

  function drawNodes(ctx, nodes, nodePositions) {
      nodes.forEach(node => {
        const pos = nodePositions[node];
       
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#4285F4';
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
  }

  // --- 4. GRAPH DRAWING FUNCTIONS ---

  // Draws the initial graph (to match the large graph in your photo)
  const drawGraph = () => {
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

    // 1. Calculate Positions
    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      nodePositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // 2. Draw Edges (Curved logic for clarity)
    nodes.forEach(source => {
      if(!graph[source]) return;
     
      graph[source].forEach(([target, weight]) => {
        const start = nodePositions[source];
        const end = nodePositions[target];
        if (!start || !end) return;
       
        const hasReverse = graph[target]?.some(([n]) => n === source);

        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#555';
        ctx.beginPath();

        let labelX, labelY;

        if (hasReverse && source !== target) {
            // --- CURVED EDGE ---
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
           
            const offset = 50; 
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
           
            const nx = -dy / dist;
            const ny = dx / dist;
           
            const cpX = midX + nx * offset;
            const cpY = midY + ny * offset;

            ctx.moveTo(start.x, start.y);
            ctx.quadraticCurveTo(cpX, cpY, end.x, end.y);
            ctx.stroke();

            labelX = (start.x + 2*cpX + end.x) / 4;
            labelY = (start.y + 2*cpY + end.y) / 4;

            const arrowAngle = Math.atan2(end.y - cpY, end.x - cpX);
            drawArrowHead(ctx, end.x, end.y, arrowAngle);

        } else {
            // --- STRAIGHT EDGE ---
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            labelX = (start.x + end.x) / 2;
            labelY = (start.y + end.y) / 2;

            const arrowAngle = Math.atan2(end.y - start.y, end.x - start.x);
            drawArrowHead(ctx, end.x, end.y, arrowAngle);
        }

        // Draw Weight
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(labelX, labelY, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.stroke();
       
        ctx.fillStyle = '#d93025'; 
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(weight, labelX, labelY);
      });
    });

    // 3. Draw Nodes
    drawNodes(ctx, nodes, nodePositions);
  };

  // Draws ONLY the edges that correspond to the final shortest paths (single graph view)
  const drawShortestPaths = (pathMatrix) => {
    if (!canvasRef.current || !graph || !pathMatrix) return;

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

    // 1. Calculate Positions
    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      nodePositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // 2. Draw Edges based on Path Matrix (Predecessors)
    ctx.strokeStyle = '#4A00B7';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#4A00B7';

    // Using a Set to track drawn edges (predecessor -> destination) to avoid drawing the same edge multiple times
    const drawnEdges = new Set(); 

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            const predecessorIndex = pathMatrix[i][j];

            if (predecessorIndex !== null && predecessorIndex !== Infinity && i !== j) {
                const predecessorNode = nodes[predecessorIndex];
                const destinationNode = nodes[j];
               
                // Edge identifier: "predecessorNode->destinationNode"
                const edgeKey = `${predecessorNode}->${destinationNode}`;

                if (!drawnEdges.has(edgeKey)) {
                    drawnEdges.add(edgeKey);

                    const source = nodePositions[predecessorNode];
                    const target = nodePositions[destinationNode];

                    // Draw the edge from predecessor to destination
                    ctx.beginPath();
                    ctx.moveTo(source.x, source.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.stroke();

                    // Draw Arrow Head
                    const arrowAngle = Math.atan2(target.y - source.y, target.x - source.x);
                    drawArrowHead(ctx, target.x, target.y, arrowAngle);
                }
            }
        }
    }

    // 3. Draw Nodes
    drawNodes(ctx, nodes, nodePositions);
  };

  // --- 5. VISUAL EFFECT HOOK ---

  useEffect(() => {
    // Always display the initial input graph
    drawGraph();
  }, [graph]);

  // --- 6. RENDER HELPER FOR MATRICES ---

  const renderMatrix = (matrix, title, isPathMatrix = false) => {
    if (!matrix || matrix.length === 0) return null;
    const nodes = Object.keys(graph).sort();
    return (
      <div className="mt-2">
        <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-1">{title}</h4>
        <div className="overflow-x-auto">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-1 bg-gray-100"></th>
                {nodes.map(n => <th key={n} className="border border-gray-300 p-1 bg-gray-100 w-8">{n}</th>)}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 p-1 bg-gray-100 font-bold w-8 text-center">{nodes[i]}</td>
                  {row.map((cell, j) => {
                    let displayValue;
                    let cellClass = 'border border-gray-300 p-1 text-center';

                    if (isPathMatrix) {
                      if (cell === null || cell === Infinity) {
                        displayValue = '-';
                        cellClass += ' text-gray-400';
                      } else {
                        displayValue = nodes[cell]; // Display node label
                        cellClass += ' font-semibold text-orange-600';
                      }
                    } else {
                      if (cell === Infinity) {
                        displayValue = '∞';
                        cellClass += ' text-gray-400';
                      } else {
                        displayValue = cell;
                        cellClass += ' font-semibold text-blue-600';
                      }
                    }

                    return (
                      <td key={j} className={cellClass}>
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --- 7. MAIN RENDER ---

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
          Floyd-Warshall Algorithm
        </h1>
       
        {/* Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 flex gap-4 items-center justify-center">
            <button 
                onClick={fetchGraphData}
                className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition font-medium shadow-sm flex items-center gap-2"
            >
                <span>🔄</span> Refresh Graph
            </button>
            <button 
                onClick={executeFloyd}
                disabled={!graph || loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium shadow-sm flex items-center gap-2"
            >
                <span>▶</span> Run Algorithm
            </button>
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Canvas */}
            <div className="lg:col-span-5 flex flex-col">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                        Initial Graph
                    </h2>
                    <div className="flex justify-center bg-gray-50 rounded border border-gray-200">
                         <canvas ref={canvasRef} width={450} height={450} />
                    </div>
                </div>
            </div>

            {/* Right: Steps & Results */}
            <div className="lg:col-span-7 space-y-6">
                {steps.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800">Algorithm Steps</h2>
                        <div className="space-y-6">
                            {steps.map((step, idx) => (
                                <div key={idx} className={`bg-white p-5 rounded-lg shadow-sm border ${step.type === 'final' ? 'border-l-8 border-green-500 ring-2 ring-green-50' : 'border-l-4 border-blue-500'}`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="font-bold text-lg text-gray-800">{step.message}</p>
                                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">Step {idx}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-6 mb-4">
                                        {renderMatrix(step.distance_matrix,)}
                                    </div>

                                    {step.type === 'final' && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h3 className="font-bold text-md text-green-700 mb-3">All Optimal Paths</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {getAllPaths(step.distance_matrix, step.path_matrix).map((res, i) => (
                                                    <div key={i} className="flex flex-col justify-between items-start bg-green-50 p-2 rounded border border-green-100 text-sm">
                                                        <span className="font-bold text-gray-700">{res.from} → {res.to}</span>
                                                        <div className="w-full flex justify-between items-center mt-1">
                                                            <div className="font-bold text-blue-700">Cost: {res.cost}</div>
                                                            <div className="text-xs text-gray-600 font-mono italic">{res.path}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-400 text-lg">Run the algorithm to see results here.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Floyd;