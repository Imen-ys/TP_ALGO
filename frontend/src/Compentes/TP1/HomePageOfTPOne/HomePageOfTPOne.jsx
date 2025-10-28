import { useState } from "react";
import {NavBar} from '../../index';
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
      type === "grapheNonOriente"
        ? "http://127.0.0.1:5000/grapheNonOriente/upload"
        : type === "grapheOriente"
        ? "http://127.0.0.1:5000/grapheOriente/upload"
        : type === "grapheNonPondere"
        ? "http://127.0.0.1:5000/grapheNonPondere/upload"
        : type === "graphePondere"
        ? "http://127.0.0.1:5000/graphePondere/upload"
        : null;

    if (!url) return alert("Unknown type");

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert("File uploaded successfully!");
      console.log("Server response:", data);
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed");
    }
  };

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8">
      <div className="mb-8 flex flex-col items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-3 border border-green-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => handleUpload("abr")}
          className="px-6 py-2 bg-green-700 text-white rounded-2xl shadow-md hover:bg-green-800 transition-all duration-200"
        >
          Upload File
        </button>
      </div>

      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        Les Graphes
      </h1>
      <div className="flex flex-wrap gap-4 mb-12 justify-center">

        <button onClick={() => handleUpload("grapheOriente")}>
          <a
            href="/tp2/grapheOriente"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Graphe Oriente
          </a>
        </button>

        <button onClick={() => handleUpload("grapheNonOriente")}>
          <a
            href="/tp1/graphe-non-oriente"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Graphe Non Oriente
          </a>
        </button>

        <button onClick={() => handleUpload("grapheNonPondere")}>
        <a
            href="/tp2/grapheNonPondere"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
            Graphe Non Pondere
        </a>
        </button>

        <button onClick={() => handleUpload("graphePondere")}>
          <a
            href="/tp2/graphePondere"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Graphe Pondere
          </a>
        </button>

      </div>
    </div>
    </>
  );
};

export default HomePageOfTPOne;