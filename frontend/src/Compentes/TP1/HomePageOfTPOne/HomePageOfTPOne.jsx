import { useState } from "react";
import { NavBar } from '../../index';

const HomePageOfTPOne = ({ onUploadComplete }) => {
  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"
  const [selectedFile, setSelectedFile] = useState("");
  const [userFile, setUserFile] = useState(null);
  const [useCustomFile, setUseCustomFile] = useState(false);
  
  // Predefined list of graph files with their content
  const graphFiles = [
    { 
      name: "graphe_oriente.txt", 
      type: "grapheOriente",
      content: "[[A,B][5]],[[A,C][9]],[[B,D][3]],[[C,E][12]],[[D,E][7]],[[E,F][4]],[[F,G][15]],[[G,H][8]],[[H,A][11]],[[B,G][2]]" 
    },
    { 
      name: "graphe_non_oriente.txt", 
      type: "grapheNonOriente",
      content: "[[A,B][5]],[[A,C][9]],[[B,D][3]],[[C,E][12]],[[D,E][7]],[[E,F][4]],[[F,G][15]],[[G,H][8]],[[H,A][11]],[[B,G][2]]" 
    },
    { 
      name: "graphe_non_pondere.txt", 
      type: "grapheNonPondere",
      content: "[[A,B]],[[A,C]],[[B,D]],[[C,E]],[[D,E]],[[E,F]],[[F,G]],[[G,H]],[[H,A]],[[B,G]]" 
    },
    { 
      name: "graphe_pondere.txt", 
      type: "graphePondere",
      content: "[[A,B][5]],[[A,C][9]],[[B,D][3]],[[C,E][12]],[[D,E][7]],[[E,F][4]],[[F,G][15]],[[G,H][8]],[[H,A][11]],[[B,G][2]]" 
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
      formData.append("file", userFile);
    } else if (selectedFile) {
      const fileData = graphFiles.find(f => f.name === selectedFile);
      if (fileData) {
        const blob = new Blob([fileData.content], { type: 'text/plain' });
        formData.append("file", blob, selectedFile);
      }
    }

    const url =
      type === "grapheNonOriente"
        ? `${BACKEND_URL}/grapheNonOriente/upload`
        : type === "grapheOriente"
        ? `${BACKEND_URL}/grapheOriente/upload`
        : type === "grapheNonPondere"
        ? `${BACKEND_URL}/grapheOriente/upload`
        : type === "graphePondere"
        ? `${BACKEND_URL}/graphePondere/upload`
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
            <label className="block mb-2 text-green-700 font-medium">Choose a predefined graph file:</label>
            <select
              value={selectedFile}
              onChange={handleFileChange}
              className="mb-3 border border-green-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            >
              <option value="" disabled>Select a file</option>
              {graphFiles.map((file, index) => (
                <option key={index} value={file.name}>{file.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleUpload("grapheOriente")}
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
              href="/tp1/graphe-oriente"
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
              href="/tp1/graphe-non-pondere"
              className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700 transition-all duration-200"
            >
              Graphe Non Pondere
            </a>
          </button>

          <button onClick={() => handleUpload("graphePondere")}>
            <a
              href="/tp1/graphe-pondere"
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