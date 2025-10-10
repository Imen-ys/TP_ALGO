import Tree from "react-d3-tree";
import { useState } from "react";
import {NavBar , HomePageOfTPOne} from "../index"

const ABR = () => {
    const [number, setNumber] = useState("");
    const [treeData, setTreeData] = useState(null);
    const [info, setInfo] = useState(null);


    const handleInsert = async () => {
    if (!number) return;
    const res = await fetch("http://127.0.0.1:5000/abr/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: parseInt(number) }),
    });
    const data = await res.json();
    setTreeData(data);
    setNumber("");
    };

    const handleReset = async () => {
    await fetch("http://127.0.0.1:5000/reset", { method: "POST" });
    setTreeData(null);
    };


    const fetchInfo = async () => {
    const res = await fetch("http://127.0.0.1:5000/abr/info");
    const data = await res.json();
    setInfo(data);
    };

    return (
        <div>
          <NavBar />
          <HomePageOfTPOne />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Arbre binaire de recherche (ABR)</h1>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter number"
          />
          <button
            onClick={handleInsert}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Insert
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        <button
        onClick={fetchInfo}
        className="bg-green-500 text-white px-4 py-2 rounded"
        >
        Get Info
        </button>

        {info && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
            <p><strong>Hauteur:</strong> {info.height -1}</p>
            <p><strong>Degré:</strong> {info.degree}</p>
            <p><strong>Densité:</strong> {info.density.toFixed(2)}</p>
        </div>
        )}

        {/* Tree display centered */}
        <div
          id="treeWrapper"
          className="flex items-center justify-center border bg-white rounded shadow"
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
}

export default ABR;

