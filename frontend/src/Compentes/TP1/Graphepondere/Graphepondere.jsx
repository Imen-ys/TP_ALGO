import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import {NavBar , HomePageOfTPOne} from "../../index"

const GraphePondere = () => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [src, setSrc] = useState("");
  const [dest, setDest] = useState("");
  const [weight, setWeight] = useState("");

  // Charger graphe du backend
  const fetchGraph = async () => {
    const res = await fetch("http://localhost:5000/graphpendere/get");
    const data = await res.json();

    const newNodes = Object.keys(data.graph).map((n) => ({ id: n, label: n }));
    const newEdges = [];
    for (let src in data.graph) {
      data.graph[src].forEach(([d, w]) => {
        newEdges.push({ from: src, to: d, label: String(w), arrows: "to" });
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);

    if (networkRef.current) {
      networkRef.current.setData({ nodes: newNodes, edges: newEdges });
    } else {
      networkRef.current = new Network(
        containerRef.current,
        { nodes: newNodes, edges: newEdges },
        {
          edges: {
            arrows: { to: { enabled: true } },
            font: { align: "middle" },
          },
          physics: { enabled: true },
        }
      );
    }
  };

  const addNode = async () => {
    await fetch("http://localhost:5000/graphpendere/add_node", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ node: nodeName }),
    });
    setNodeName("");
    fetchGraph();
  };

  const addEdge = async () => {
    await fetch("http://localhost:5000/graphpendere/add_edge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src, dest, weight: parseInt(weight) }),
    });
    setSrc("");
    setDest("");
    setWeight("");
    fetchGraph();
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return (
    <div className="p-4">
        <NavBar />
        <HomePageOfTPOne />
      <h2 className="text-xl font-bold mb-4">Graphe Pondéré</h2>

      {/* Ajout sommet */}
      <div className="flex gap-2 mb-4 ml-60">
        <input
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Nom du sommet"
          className="border p-2"
        />
        <button
          onClick={addNode}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ajouter Sommet
        </button>
      </div>

      {/* Ajout arête pondérée */}
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
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Poids"
          type="number"
          className="border p-2"
        />
        <button
          onClick={addEdge}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Ajouter Arête
        </button>
      </div>

      <div
        ref={containerRef}
        style={{ height: "500px", border: "1px solid black" }}
      ></div>
    </div>
  );
};

export default GraphePondere;
