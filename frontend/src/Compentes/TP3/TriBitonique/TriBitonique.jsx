import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Tribitonique = () => {
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const intervalRef = useRef(null);
  const BACKEND_URL = "https://tp-algo-j0wl.onrender.com"

  const handleSort = async () => {
    setIsLoading(true);
    setError(null);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);

    try {
      const response = await fetch(`${BACKEND_URL}/bitonique/sort`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Sorting failed");
      setSteps(data.steps);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSpeedChange = (e) => {
    setAnimationSpeed(parseInt(e.target.value));
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, animationSpeed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, animationSpeed]);

  const getNumberStyle = (index) => {
    if (!steps[currentStep]) return {};
    
    const { swapped, comparing } = steps[currentStep];
    
    if (swapped.includes(index)) {
      return {
        backgroundColor: '#ef4444',
        color: 'white',
        transform: 'scale(1.1)',
        transition: 'all 0.3s ease'
      };
    } else if (comparing.includes(index)) {
      return {
        backgroundColor: '#3b82f6',
        color: 'white',
        transform: 'scale(1.05)',
        transition: 'all 0.3s ease'
      };
    }
    
    if (steps[currentStep].array[index] === "Infinity") {
      return {
        backgroundColor: '#fbbf24',
        color: '#78350f',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
      };
    }
    
    return {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      transition: 'all 0.3s ease'
    };
  };

  const formatNumber = (num) => {
    if (num === "Infinity") {
      return "+∞";
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">Tri bitonique</h1>
        <Link 
          to="/tp3" 
          className="mb-6 inline-block px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
        >
          &larr; Back to Algorithms
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col items-center">
          <button
            onClick={handleSort}
            disabled={isLoading}
            className="px-6 py-2 bg-green-700 text-white rounded-2xl shadow-md hover:bg-green-800 transition-all duration-200 disabled:bg-gray-400 mb-4"
          >
            {isLoading ? 'Processing...' : 'Start Sorting'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {steps.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <button
                onClick={handleStepBackward}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-400"
              >
                Step Backward
              </button>
              
              <button
                onClick={handlePlayPause}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
              >
                Reset
              </button>
              
              <button
                onClick={handleStepForward}
                disabled={currentStep === steps.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-400"
              >
                Step Forward
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <label htmlFor="speed" className="text-gray-700">Animation Speed:</label>
              <input
                type="range"
                id="speed"
                min="100"
                max="2000"
                step="100"
                value={animationSpeed}
                onChange={handleSpeedChange}
                className="w-48"
              />
              <span className="text-gray-700">{animationSpeed}ms</span>
            </div>
            
            <div className="mt-4 text-center">
              <span className="text-gray-700">Step: {currentStep + 1} / {steps.length}</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {steps.length > 0 && steps[currentStep] && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Step {currentStep + 1} 
              {currentStep === 0 ? " (Initial State)" : 
                currentStep === steps.length - 1 ? " (Final Sorted State)" : 
                steps[currentStep].swapped.length > 0 ? " (Swapped Elements)" : 
                steps[currentStep].comparing.length > 0 ? " (Comparing Elements)" : ""}
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {steps[currentStep].array.map((num, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-md font-mono text-sm shadow"
                  style={getNumberStyle(i)}
                >
                  {formatNumber(num)}
                </span>
              ))}
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Legend</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d1fae5' }}></div>
                <span className="text-sm">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                <span className="text-sm">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                <span className="text-sm">Swapped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
                <span className="text-sm">Padding (+∞)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tribitonique;