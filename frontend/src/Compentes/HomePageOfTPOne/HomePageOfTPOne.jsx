import { useState } from "react";

const HomePageOfTPOne = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (type) => {
    if (!selectedFile) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", selectedFile);


    const url =
      type === "abr"
        ? "http://127.0.0.1:5000/upload"
        : type === "avl"
        ? "http://127.0.0.1:5000/avl/upload"
        : type === "tasmin"
        ? "http://127.0.0.1:5000/tasmin/upload"
        : type === "tasmax"
        ? "http://127.0.0.1:5000/tasmax/upload"
        : null;

    // if (!url) return alert("Unknown type");

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert("File uploaded successfully!");
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8">


      <div className="mb-8 flex flex-col items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-3 border border-green-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleUpload}
          className="px-6 py-2 bg-green-700 text-white rounded-2xl shadow-md hover:bg-green-800 transition-all duration-200"
        >
          Upload File
        </button>
      </div>

      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        Les Arbres
      </h1>
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        <button  onClick={() => handleUpload("abr")} >
        <a
          href="/tp1/abr"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
          ABR
        </a>
        </button>

        <button onClick={() => handleUpload("avl")}>
        <a
          href="/tp1/avl"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
          AVL
        </a>
        </button>

        <button onClick={() => handleUpload("tasmin")}>
        <a
          href="/tp1/tasmin"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
          TASMIN
        </a>
        </button>

        <button onClick={() => handleUpload("tasmax")}>
        <a
          href="/tp1/tasmax"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
          TASMAX
        </a>
        </button>
        <button onClick={() => handleUpload("amr")}>
        <a
          href="/tp1/amr"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
          AMR
        </a>
        </button>
        <a
          href="/tp1/B_ARBER"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
          B_ARBER
        </a>
      </div>

      {/* 🧩 Graph Section */}
      <h2 className="text-3xl font-semibold text-green-700 mb-6 text-center">
        Les Graphes
      </h2>

      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="/tp1/graphe-oriente"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Graphe orienté
        </a>
        <a
          href="/tp1/graphe-non-oriente"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Graphe non orienté
        </a>
        <a
          href="/tp1/graphe-pondere"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Graphe pondéré
        </a>
        <a
          href="/tp1/graphe-non-pondere"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Graphe non pondéré
        </a>
      </div>
    </div>
  );
};

export default HomePageOfTPOne;
