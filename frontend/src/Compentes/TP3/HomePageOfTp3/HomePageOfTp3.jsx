import { useState } from "react";
import { NavBar } from '../../index';

const HomePageOfTP3 = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [userFile, setUserFile] = useState(null);
  const [useCustomFile, setUseCustomFile] = useState(false);
  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"
  
  // Predefined list of text files with their content
  const textFiles = [
    { 
      name: "TP3.txt", 
      content: "5\n3\n8\n1\n9\n2\n7\n4\n6" 
    },
    { 
      name: "Bitonique_cas_pair.txt", 
      content: "8\n3\n7\n4\n9\n2\n6\n5\n1" 
    },
    { 
      name: "Bitonique_cas_impair.txt", 
      content: "7\n3\n9\n1\n8\n2\n6\n4\n5" 
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
      const fileData = textFiles.find(f => f.name === selectedFile);
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
        : type === "bitonique"
        ? `${BACKEND_URL}/bitonique/upload`
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
            <label className="block mb-2 text-green-700 font-medium">Choose a predefined file:</label>
            <select
              value={selectedFile}
              onChange={handleFileChange}
              className="mb-3 border border-green-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            >
              <option value="" disabled>Select a file</option>
              {textFiles.map((file, index) => (
                <option key={index} value={file.name}>{file.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4 w-full max-w-md">
            <label className="block mb-2 text-green-700 font-medium">Or upload your own file:</label>
            <input
              type="file"
              accept=".txt"
              onChange={handleUserFileChange}
              className="mb-3 border border-green-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            />
          </div>
          
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