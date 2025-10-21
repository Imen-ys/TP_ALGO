import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { NavBar, HomePageOfTPOne } from "../index";

const TASMAX = () => {
  const [treeData, setTreeData] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteValue, setDeleteValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const fetchTree = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/tasmax/show");
      const data = await res.json();
      setTreeData(data);
    } catch (err) {
      setError("Erreur lors du chargement de l'arbre");
    }
  };

  const fetchInfo = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/tasmax/info");
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      setError("Erreur lors du chargement des informations");
    }
  };

  const handleDelete = async () => {
    if (!deleteValue) {
      setDeleteMessage("Veuillez entrer une valeur à supprimer");
      return;
    }
    
    try {
      const res = await fetch("http://127.0.0.1:5000/tasmax/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: parseInt(deleteValue) }),
      });
      const data = await res.json();
      setDeleteMessage(data.message);
      setTreeData(data.tree);
      // Refresh info after deletion
      fetchInfo();
    } catch (err) {
      setDeleteMessage("Erreur lors de la suppression de la valeur");
    }
  };

  const handleSearch = async () => {
    if (!searchValue) {
      setSearchResult({ found: false, message: "Veuillez entrer une valeur à rechercher" });
      return;
    }
    
    try {
      const res = await fetch("http://127.0.0.1:5000/tasmax/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: parseInt(searchValue) }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      setSearchResult({ found: false, message: "Erreur lors de la recherche" });
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
        TAS MAX
      </h1>

      <button
        onClick={handleRefresh}
        className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
      >
        Rafraîchir l'arbre
      </button>

      {/* Delete Section */}
      <div className="bg-white p-4 rounded-xl shadow w-80 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Supprimer une valeur
        </h2>
        <div className="flex space-x-2">
          <input
            type="number"
            value={deleteValue}
            onChange={(e) => setDeleteValue(e.target.value)}
            className="flex-1 p-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Valeur à supprimer"
          />
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
          >
            Supprimer
          </button>
        </div>
        {deleteMessage && (
          <p className={`mt-2 ${deleteMessage.includes("not found") ? "text-red-500" : "text-green-600"}`}>
            {deleteMessage}
          </p>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-white p-4 rounded-xl shadow w-80 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Rechercher une valeur
        </h2>
        <div className="flex space-x-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 p-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Valeur à rechercher"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          >
            Rechercher
          </button>
        </div>
        {searchResult && (
          <p className={`mt-2 ${searchResult.found ? "text-green-600" : "text-red-500"}`}>
            {searchResult.message}
          </p>
        )}
      </div>

      {/* ℹ️ Info Section */}
      {info && (
        <div className="bg-white p-4 rounded-xl shadow w-80 text-center mb-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Informations sur l'arbre
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

export default TASMAX;