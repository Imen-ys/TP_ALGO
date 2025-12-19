import { useState } from "react";
import { NavBar } from '../../index';

const HomePageOfTP4 = ({ onUploadComplete }) => {
  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"
  const [selectedFile, setSelectedFile] = useState("");
  const [userFile, setUserFile] = useState(null);
  const [useCustomFile, setUseCustomFile] = useState(false);
  
  // Predefined list of graph files with their content
  const graphFiles = [
    { 
      name: "Prim.txt", 
      content: "[[A,B][5]],[[A,C][9]],[[B,D][3]],[[C,E][12]],[[D,E][7]],[[E,F][4]],[[F,G][15]],[[G,H][8]],[[H,A][11]],[[B,G][2]]"
    },
    { 
      name: "Kruskal.txt",
      content: "[[A,B][5]],[[A,C][9]],[[B,D][3]],[[C,E][12]],[[D,E][7]],[[E,F][4]],[[F,G][15]],[[G,H][8]],[[H,A][11]],[[B,G][2]]"
    },
    { 
      name: "Floyd.txt", 
      content: "[[a,b][2]],[[b,d][-2]],[[d,b][5]],[[d,c][5]],[[c,b][-1]],[[c,a][-4]],[[a,c][6]]"
    },
    { 
      name: "Welsh_Powell.txt", 
      content: "[[A,B][2]],[[A,E][2]],[[A,F][2]],[[A,G][2]],[[B,H][2]],[[B,C][2]],[[B,D][2]],[[C,D][2]],[[D,H][2]],[[H,G][2]],[[G,E][2]],[D,E][2]],[[F,E][2]]," 
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
      type === "prim"
        ? `${BACKEND_URL}/prim/upload`
        : type === "kruskal"
        ? `${BACKEND_URL}/Kruskal/upload`
        : type === "floyd"
        ? `${BACKEND_URL}/floyd/upload`
        : type === "welsh_powell"
        ? `${BACKEND_URL}/welsh_powell/upload`
        : null;

    if (!url) return alert("Unknown type");

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
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
            onClick={() => handleUpload("prim")}
            className="px-6 py-2 bg-green-700 text-white rounded-2xl shadow-md hover:bg-green-800 transition-all duration-200"
          >
            Upload File
          </button>
        </div>

        <h1 className="text-4xl font-bold text-green-700 mb-12 text-center">
          LES ALGORITHMES
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