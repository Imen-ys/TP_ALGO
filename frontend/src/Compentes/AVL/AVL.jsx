import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { NavBar, HomePageOfTPOne } from "../index";

const AVL = () => {
  const [treeData, setTreeData] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTree = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/avl/show");
      const data = await res.json();
      setTreeData(data);
    } catch (err) {
      setError("Erreur lors du chargement de l’arbre");
    }
  };

  const fetchInfo = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/avl/info");
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      setError("Erreur lors du chargement des informations");
    }
  };


  useEffect(() => {
    Promise.all([fetchTree(), fetchInfo()]).finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchTree(), fetchInfo()]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <NavBar />
      <HomePageOfTPOne />
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        AVL
      </h1>

      <button
        onClick={handleRefresh}
        className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
      >
        Rafraîchir l’arbre
      </button>
      {/* ℹ️ Info Section */}
          {info && (
            <div className="bg-white p-4 rounded-xl shadow w-80 text-center">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                Informations sur l’arbre
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Hauteur :</strong> {info.height}
                </p>
                <p>
                  <strong>Degré maximal :</strong> {info.degree}
                </p>
                <p>
                  <strong>Densité :</strong> {info.density.toFixed(2)}
                </p>
              </div>
            </div>
          )}
      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/*  Visual Tree Section */}
          {treeData ? (
            <div className="bg-white p-4 rounded-xl shadow w-full h-[500px] flex items-center justify-center mb-8">
              <Tree
                data={treeData}
                orientation="vertical"
                translate={{ x: 600, y: 60 }}
                zoom={0.8}
                separation={{ siblings: 1.2, nonSiblings: 1.8 }}
                pathFunc="elbow"
                styles={{
                  links: {
                    stroke: "#16a34a", // green
                    strokeWidth: 2,
                  },
                  nodes: {
                    node: {
                      circle: {
                        fill: "#16a34a",
                        stroke: "#14532d",
                        strokeWidth: 2,
                      },
                      name: { fill: "#14532d", fontWeight: "bold" },
                    },
                    leafNode: {
                      circle: {
                        fill: "#86efac",
                        stroke: "#15803d",
                        strokeWidth: 2,
                      },
                      name: { fill: "#14532d", fontWeight: "bold" },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500">Aucun arbre à afficher</p>
          )}
        </>
      )}
    </div>
  );
};

export default AVL;
