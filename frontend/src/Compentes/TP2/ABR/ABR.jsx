import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { NavBar, HomePageOfTP2 } from "../../index";

const ABR = () => {
  const [treeData, setTreeData] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [deleteResult, setDeleteResult] = useState(null);

  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"

  const fetchTree = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/abr/show`);
      const data = await res.json();
      setTreeData(data);
    } catch (err) {
      setError("Erreur lors du chargement de l'arbre");
    }
  };

  const fetchInfo = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/abr/info`);
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

  const handleSearch = async () => {
    if (!searchValue) return;
    try {
      const response = await fetch(`${BACKEND_URL}/abr/search`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: parseInt(searchValue) }), 
      });
      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Error searching value:", error);
      setSearchResult({ message: "Search failed", exists: false });
    }
  };

  const handleDelete = async () => {
    if (!deleteValue) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/abr/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: parseInt(deleteValue) }),
      });
      const data = await response.json();
      setDeleteResult(data);
      
      if (data.success) {
        await fetchTree();
        await fetchInfo();
      }
    } catch (error) {
      console.error("Error deleting value:", error);
      setDeleteResult({ message: "Delete failed", success: false });
    }
  };

  return (
    <>
      <NavBar />
      <HomePageOfTP2 />
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">

      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Arbre Binaire de Recherche (ABR)
      </h1>

      <button
        onClick={handleRefresh}
        className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
      >
        Rafraîchir l'arbre
      </button>

      <div className="bg-white p-4 rounded-xl shadow w-80 mb-4">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Rechercher une valeur
        </h2>
        <div className="flex gap-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 p-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Entrez une valeur"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Rechercher
          </button>
        </div>
        {searchResult && (
          <div className={`mt-2 p-2 rounded ${searchResult.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {searchResult.message}
          </div>
        )}
      </div>


      <div className="bg-white p-4 rounded-xl shadow w-80 mb-4">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Supprimer une valeur
        </h2>
        <div className="flex gap-2">
          <input
            type="number"
            value={deleteValue}
            onChange={(e) => setDeleteValue(e.target.value)}
            className="flex-1 p-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Entrez une valeur"
          />
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Supprimer
          </button>
        </div>
        {deleteResult && (
          <div className={`mt-2 p-2 rounded ${deleteResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {deleteResult.message}
          </div>
        )}
      </div>

      {info && (
        <div className="bg-white p-4 rounded-xl shadow w-80 text-center mb-4">
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
                    stroke: "#16a34a",
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
    </>
  );
};

export default ABR;