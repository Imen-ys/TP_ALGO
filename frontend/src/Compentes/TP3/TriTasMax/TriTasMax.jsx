import { NavBar, HomePageOfTP3 } from "../../index";
import { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";

const TriTASMAX = () => {
    const [heapData, setHeapData] = useState(null);
    const [extractionSequence, setExtractionSequence] = useState([]);
    const [sortedValues, setSortedValues] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const animationRef = useRef(null);

    // Fetch the heap data
    const fetchHeap = async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/tasmax/show");
            const data = await res.json();
            setHeapData(data);
        } catch (err) {
            setError("Erreur lors du chargement du tas TASMAX");
        }
    };

    // Fetch the extraction sequence
    const fetchExtractionSequence = async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/tasmax/extraction/sequence");
            const data = await res.json();
            setExtractionSequence(data.sequence);
        } catch (err) {
            setError("Erreur lors du chargement de la séquence d'extraction");
        }
    };

    // Fetch heap at a specific step
    const fetchHeapAtStep = async (step) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/tasmax/heap/step/${step}`);
            const data = await res.json();
            setHeapData(data);
        } catch (err) {
            setError("Erreur lors du chargement de l'état du tas");
        }
    };

    // Start the animation
    const startAnimation = () => {
        if (extractionSequence.length === 0) return;
        
        setIsAnimating(true);
        setCurrentStep(0);
        setSortedValues([]);
        
        // Reset heap to initial state
        fetchHeap();
        
        // Start the step-by-step animation
        animationRef.current = setTimeout(() => {
            animateStep(0);
        }, 1000);
    };

    // Animate each step
    const animateStep = (step) => {
        if (step >= extractionSequence.length) {
            setIsAnimating(false);
            return;
        }

        // Add the extracted value to sorted values
        setSortedValues(prev => [...prev, extractionSequence[step]]);
        
        // Show the heap after extraction
        fetchHeapAtStep(step + 1);
        
        // Move to the next step
        setCurrentStep(step + 1);
        
        // Schedule the next step
        animationRef.current = setTimeout(() => {
            animateStep(step + 1);
        }, 1500); // Adjust timing as needed
    };

    // Stop the animation
    const stopAnimation = () => {
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }
        setIsAnimating(false);
        fetchHeap(); // Reset heap to initial state
    };

    // Reset the animation
    const resetAnimation = () => {
        stopAnimation();
        setCurrentStep(0);
        setSortedValues([]);
    };

    useEffect(() => {
        Promise.all([fetchHeap(), fetchExtractionSequence()]).finally(() => setLoading(false));
        
        // Clean up animation on unmount
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);

    // Custom node rendering to highlight nodes
    const renderNodeWithCustomization = ({ nodeDatum, toggleNode }) => {
        const isHighlighted = nodeDatum.attributes?.highlight;
        
        return (
            <g>
                <circle
                    r={15}
                    fill={isHighlighted ? "#ef4444" : "#16a34a"} // Red if highlighted, green otherwise
                    stroke={isHighlighted ? "#991b1b" : "#14532d"}
                    strokeWidth={2}
                />
                <text
                    fill="white"
                    strokeWidth={0}
                    x={0}
                    y={5}
                    textAnchor="middle"
                    fontWeight="bold"
                >
                    {nodeDatum.name}
                </text>
            </g>
        );
    };

    return (
        <div>
            <NavBar />
            <HomePageOfTP3 />

            <div className="min-h-screen flex flex-col items-center bg-green-50 p-6">
                <h1 className="text-3xl font-bold text-green-700 mb-6">
                    Tri par TASMAX avec Animation
                </h1>

                {loading ? (
                    <p className="text-gray-500">Chargement...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        {/* Control buttons */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={startAnimation}
                                disabled={isAnimating || extractionSequence.length === 0}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                Démarrer l'animation
                            </button>
                            <button
                                onClick={stopAnimation}
                                disabled={!isAnimating}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                Arrêter
                            </button>
                            <button
                                onClick={resetAnimation}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Réinitialiser
                            </button>
                        </div>

                        {/* Heap visualization */}
                        {heapData ? (
                            <div className="bg-white p-4 rounded-xl shadow w-full h-[500px] flex items-center justify-center mb-8">
                                <Tree
                                    data={heapData}
                                    orientation="vertical"
                                    translate={{ x: 600, y: 60 }}
                                    zoom={0.8}
                                    separation={{ siblings: 1.2, nonSiblings: 1.8 }}
                                    pathFunc="elbow"
                                    renderCustomNodeElement={renderNodeWithCustomization}
                                    styles={{
                                        links: {
                                            stroke: "#16a34a",
                                            strokeWidth: 2,
                                        },
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-8">Aucun tas à afficher</p>
                        )}

                        {/* Sorted values display */}
                        <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
                            <h2 className="text-lg font-semibold text-green-700 mb-2">
                                Valeurs triées (Extraction du tas) :
                            </h2>
                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                {sortedValues.length > 0 ? (
                                    sortedValues.map((value, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-1 rounded-full ${
                                                index === currentStep - 1
                                                    ? "bg-red-500 text-white"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {value}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Aucune valeur triée</p>
                                )}
                            </div>
                            {isAnimating && (
                                <p className="text-sm text-gray-500">
                                    Étape {currentStep} sur {extractionSequence.length}
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TriTASMAX;