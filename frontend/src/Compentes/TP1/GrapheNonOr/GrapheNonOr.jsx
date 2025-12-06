import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import { NavBar, HomePageOfTPOne } from "../../index";

const GrapheNonOriente = () => {
  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [graphData, setGraphData] = useState(null);

  const fetchGraph = async () => {
    const res = await fetch(`${BACKEND_URL}/grapheNonOriente/get`);
    const data = await res.json();
    const graph = data.graph;

    const nodes = Object.keys(graph).map((n) => ({ id: n, label: n }));
    const edges = [];

    for (let src in graph) {
      graph[src].forEach((dest) => {
        if (!edges.some(e => (e.from === dest && e.to === src))) {
          edges.push({ from: src, to: dest });
        }
      });
    }

    setGraphData({ nodes, edges });

    if (networkRef.current) {
      networkRef.current.setData({ nodes, edges });
    } else {
      networkRef.current = new Network(
        containerRef.current,
        { nodes, edges },
        {
          nodes: { color: "#4ade80", font: { color: "#14532d", bold: true } },
          edges: { color: "#166534", width: 2 },
          physics: { enabled: true },
        }
      );
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return (
    <>
      <NavBar />
      <HomePageOfTPOne />
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Graphe Non Orienté
        </h1>

        <div
          ref={containerRef}
          className="w-[90%] h-[500px] bg-white border rounded-xl shadow-md"
        ></div>

        {!graphData && <p className="text-gray-500 mt-4">Aucun graphe à afficher</p>}
      </div>
    </>
  );
};

export default GrapheNonOriente;
