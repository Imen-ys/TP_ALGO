import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Tribitonique = () => {
  // State for the file selected by the user
  const [selectedFile, setSelectedFile] = useState(null);
  // State for the steps received from the server
  const [steps, setSteps] = useState([]);
  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null); // Clear any previous errors
  };

  const handleUploadAndSort = async () => {
    if (!selectedFile) {
      setError("Please select a file first!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSteps([]);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/bitonique/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process file.");
      }

      const data = await response.json();
      setSteps(data.steps);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">Bitonic Sort Visualization</h1>
        <Link 
          to="/tp3" 
          className="mb-6 inline-block px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
        >
          &larr; Back to Algorithms
        </Link>

        {/* File Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="flex-grow border border-green-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleUploadAndSort}
              disabled={isLoading}
              className="px-6 py-2 bg-green-700 text-white rounded-2xl shadow-md hover:bg-green-800 transition-all duration-200 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Sort File'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Steps Display Section */}
        {steps.length > 0 && (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Step {index + 1} {index === 0 ? "(Initial State)" : index === steps.length - 1 ? "(Final Sorted State)" : ""}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {step.map((num, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-mono text-sm"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tribitonique;