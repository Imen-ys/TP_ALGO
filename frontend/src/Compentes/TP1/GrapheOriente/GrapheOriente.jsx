import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import {NavBar , HomePageOfTPOne} from "../../index"

const GrapheOriente = () => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [src, setSrc] = useState("");
  const [dest, setDest] = useState("");

  // Charger le graphe depuis backend
  const fetchGraph = async () => {
    const res = await fetch("http://localhost:5000/graphOr/get");
    const data = await res.json();

    const newNodes = Object.keys(data.graph).map((n) => ({ id: n, label: n }));
    const newEdges = [];
    for (let src in data.graph) {
      data.graph[src].forEach((d) => {
        newEdges.push({ from: src, to: d, arrows: "to" });
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);

    if (networkRef.current) {
      networkRef.current.setData({ nodes: newNodes, edges: newEdges });
    } else {
      networkRef.current = new Network(containerRef.current, { nodes: newNodes, edges: newEdges }, {
        edges: { arrows: { to: { enabled: true } } },
        physics: { enabled: true }
      });
    }
  };

  // Ajouter un sommet
  const addNode = async () => {
    await fetch("http://localhost:5000/graphOr/add_node", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ node: nodeName }),
    });
    setNodeName("");
    fetchGraph();
  };

  // Ajouter une arête orientée
  const addEdge = async () => {
    await fetch("http://localhost:5000/graphOr/add_edge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src, dest }),
    });
    setSrc("");
    setDest("");
    fetchGraph();
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <NavBar />
        <HomePageOfTPOne />
      <h2 className="text-3xl font-bold mb-6">Graphe Orienté</h2>

      <div className="flex gap-2 mb-4 ml-60">
        <input
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Nom du sommet"
            className="border p-2"
        />
        <button onClick={addNode} className="bg-blue-500 text-white px-4 py-2 rounded">
            Ajouter Sommet
        </button>
        </div>

        <div className="flex gap-2 mb-4 ml-60">
        <input
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            placeholder="Source"
            className="border p-2"
        />
        <input
          value={dest}
          onChange={(e) => setDest(e.target.value)}
          placeholder="Destination"
          className="border p-2"
        />
        <button onClick={addEdge} className="bg-green-500 text-white px-4 py-2 rounded">
          Ajouter Arête
        </button>
      </div>

      <div ref={containerRef} id="treeWrapper"
        className="flex items-center justify-center border bg-white rounded shadow"
        style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default GrapheOriente;
