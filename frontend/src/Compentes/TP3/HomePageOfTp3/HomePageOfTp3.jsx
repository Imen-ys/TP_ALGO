import { useState } from "react";
import {NavBar} from '../../index';
const HomePageOfTP3 = ({ onUploadComplete }) => {
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
        : type === "bitonique"
        ? "http://127.0.0.1:5000/bitonique/upload"
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

      <h1 className="text-4xl font-bold text-green-700 mb-12 text-center">
        LES ALGORITHMES DE TRI
      </h1>
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        <button onClick={() => handleUpload("abr")}>
          <a
            href="/tp3/Triabr"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Tri par ABR
          </a>
        </button>

        <button onClick={() => handleUpload("avl")}>
          <a
            href="/tp3/Triavl"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Tri par AVL
          </a>
        </button>

        <button onClick={() => handleUpload("tasmin")}>
        <a
            href="/tp3/Tritasmin"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
            Tri par TASMIN
        </a>
        </button>

        <button onClick={() => handleUpload("tasmax")}>
          <a
            href="/tp3/Tritasmax"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Tri par TASMAX
          </a>
        </button>

        <button onClick={() => handleUpload("bitonique")}>
          <a
            href="/tp3/TriBitonique"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Tri bitonique
          </a>
        </button>

      </div>
    </div>
    </>
  );
};

export default HomePageOfTP3;