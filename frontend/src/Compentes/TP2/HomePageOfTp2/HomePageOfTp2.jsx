import { useState } from "react";
import {NavBar} from '../../index';
const HomePageOfTP2 = ({ onUploadComplete }) => {
  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"
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
        ? `${BACKEND_URL}/upload`
        : type === "avl"
        ? `${BACKEND_URL}/avl/upload`
        : type === "tasmin"
        ? `${BACKEND_URL}/tasmin/upload`
        : type === "tasmax"
        ? `${BACKEND_URL}/tasmax/upload`
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
        Les Arbres
      </h1>
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        <button onClick={() => handleUpload("abr")}>
          <a
            href="/tp2/abr"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            ABR
          </a>
        </button>

        <button onClick={() => handleUpload("avl")}>
          <a
            href="/tp2/avl"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            AVL
          </a>
        </button>

        <button onClick={() => handleUpload("tasmin")}>
        <a
            href="/tp2/tasmin"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
        >
            TASMIN
        </a>
        </button>

        <button onClick={() => handleUpload("tasmax")}>
          <a
            href="/tp2/tasmax"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            TASMAX
          </a>
        </button>

      </div>
    </div>
    </>
  );
};

export default HomePageOfTP2;