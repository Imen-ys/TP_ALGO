import { useState } from "react";
import {NavBar} from '../../index';

const HomePageOfTP4 = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (type) => {
      const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"

    if (!selectedFile) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const url =
    type === "prim"
        ? "http://127.0.0.1:5000/prim/upload"
        : type === "Kruskal"
        ? "http://127.0.0.1:5000/Kruskal/upload"
        : type === "floyd"
        ? `${BACKEND_URL}/floyd/upload`
        : type === "welsh_powell"
        ? "http://127.0.0.1:5000/welsh_powell/upload"
        : null;

    if (!url) return alert("Unknown type");

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Check content type to ensure we're getting JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON. Check if the server is running correctly.");
      }
      
      const data = await response.json();
      alert("File uploaded successfully!");
      console.log("Server response:", data);
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Upload failed: ${error.message}`);
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
            onClick={() => handleUpload("prim")}
            className="px-6 py-2 bg-green-700 text-white rounded-2xl shadow-md hover:bg-green-800 transition-all duration-200"
        >
        Upload File
        </button>
      </div>

      <h1 className="text-4xl font-bold text-green-700 mb-12 text-center">
        ACM
      </h1>
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        <button onClick={() => handleUpload("prim")}>
          <a
            href="/tp4/prim"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Prim
          </a>
        </button>

        <button onClick={() => handleUpload("kruskal")}>
          <a
            href="/tp4/kruskal"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Kruskal
          </a>
        </button>

        <button onClick={() => handleUpload("floyd")}>
          <a
            href="/tp4/floyd"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Floyd
          </a>
        </button>

        <button onClick={() => handleUpload("welsh_powell")}>
          <a
            href="/tp4/welsh_powell"
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
          >
            Welsh-Powell
          </a>
        </button>
        </div>
    </div>
    </>
  );
};

export default HomePageOfTP4;