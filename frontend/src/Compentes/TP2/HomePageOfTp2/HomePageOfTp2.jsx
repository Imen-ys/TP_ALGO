import { useState } from "react";
import { NavBar } from '../../index';

const HomePageOfTP2 = ({ onUploadComplete }) => {
  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"
  const [selectedFile, setSelectedFile] = useState("");
  const [userFile, setUserFile] = useState(null);
  const [useCustomFile, setUseCustomFile] = useState(false);
  
  // Predefined list of tree files with their content
  const treeFiles = [
    {
      name: "ABR.txt",
      content: "25, 60, 35, 10, 5, 20, 65, 45, 70, 40, 50, 55, 30, 15, 22, 62, 64, 4, 8"
    },
    {
      name: "AVL.txt",
      content: "50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85"
    },
    {
      name: "TAS_MIN.txt",
      content: "5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100"
    },
    {
      name: "TASMAX.txt",
      content: "100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5"
    },
  ];

  const handleFileChange = (e) => {
    setSelectedFile(e.target.value);
    setUseCustomFile(false);
  };

  const handleUserFileChange = (e) => {
    setUserFile(e.target.files[0]);
    setUseCustomFile(true);
  };

  const handleUpload = async (type) => {
    if (!selectedFile && !userFile) return alert("Please select a file first!");

    const formData = new FormData();
    
    if (useCustomFile && userFile) {
      // Upload the actual file from user's computer
      formData.append("file", userFile);
    } else if (selectedFile) {
      // Create a blob from the predefined file content
      const fileData = treeFiles.find(f => f.name === selectedFile);
      if (fileData) {
        const blob = new Blob([fileData.content], { type: 'text/plain' });
        formData.append("file", blob, selectedFile);
      }
    }

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
          <div className="mb-4 w-full max-w-md">
            <label className="block mb-2 text-green-700 font-medium">Choose a predefined tree file:</label>
            <select
              value={selectedFile}
              onChange={handleFileChange}
              className="mb-3 border border-green-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            >
              <option value="" disabled>Select a file</option>
              {treeFiles.map((file, index) => (
                <option key={index} value={file.name}>{file.name}</option>
              ))}
            </select>
          </div>

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