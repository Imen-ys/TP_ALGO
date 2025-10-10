import Tree from "react-d3-tree";
import { useState } from "react";
import { NavBar, HomePageOfTPOne } from "../index";

const AMR = () => {
  const [order, setOrder] = useState("");
  const [number, setNumber] = useState("");
  const [treeData, setTreeData] = useState(null);
  const [info, setInfo] = useState(null);

  const handleSetOrder = async () => {
    if (!order) return;
    await fetch("http://127.0.0.1:5000/amr/set_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: parseInt(order) }),
    });
    alert(`Ordre fixé à ${order}`);
  };

  const handleInsert = async () => {
    if (!number) return;
    const res = await fetch("http://127.0.0.1:5000/amr/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: parseInt(number) }),
    });
    const data = await res.json();
    setTreeData(data);
    setNumber("");
  };

  const handleReset = async () => {
    await fetch("http://127.0.0.1:5000/amr/reset", { method: "POST" });
    setTreeData(null);
    setInfo(null);
  };

  const fetchInfo = async () => {
    const res = await fetch("http://127.0.0.1:5000/amr/info");
    const data = await res.json();
    setInfo(data);
  };

  return (
    <div>
      <NavBar />
      <HomePageOfTPOne />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Arbre M-aire de Recherche (AMR)</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border p-2 rounded"
            placeholder="Ordre M"
          />
          <button
            onClick={handleSetOrder}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Fixer l'ordre
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border p-2 rounded"
            placeholder="Entrer une valeur"
          />
          <button
            onClick={handleInsert}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Insérer
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Réinitialiser
          </button>
        </div>

        {/* Info */}
        <button
          onClick={fetchInfo}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Obtenir Infos
        </button>

        {info && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p><strong>Hauteur:</strong> {info.height > 0 ? info.height - 1 : 0}</p>
            <p><strong>Degré:</strong> {info.degree ?? 0}</p>
            <p>
              <strong>Densité:</strong>{" "}
              {info.density !== undefined && info.density !== null
                ? info.density.toFixed(2)
                : "0.00"}
            </p>
          </div>
        )}


        {/* Arbre */}
        <div
          id="treeWrapper"
          className="flex items-center justify-center border bg-white rounded shadow mt-4"
          style={{ width: "100%", height: "500px" }}
        >
          {treeData && (
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: window.innerWidth / 2, y: 100 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AMR;
