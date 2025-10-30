import { NavBar, HomePageOfTP3 } from "../../index";
import { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";

const TriABR = () => {
    const [treeData, setTreeData] = useState(null);
    const [traversalSequence, setTraversalSequence] = useState([]);
    const [sortedValues, setSortedValues] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [highlightedNode, setHighlightedNode] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const animationRef = useRef(null);

    // Fetch the tree data
    const fetchTree = async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/abr/show");
            const data = await res.json();
            setTreeData(data);
        } catch (err) {
            setError("Erreur lors du chargement de l'arbre ABR");
        }
    };

    // Fetch the traversal sequence
    const fetchTraversalSequence = async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/abr/traversal/sequence");
            const data = await res.json();
            setTraversalSequence(data.sequence);
        } catch (err) {
            setError("Erreur lors du chargement de la séquence de parcours");
        }
    };

    // Fetch tree with highlighted node
    const fetchTreeWithHighlight = async (value) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/abr/tree/highlight/${value}`);
            const data = await res.json();
            setTreeData(data);
        } catch (err) {
            setError("Erreur lors de la mise en évidence du nœud");
        }
    };

    // Start the animation
    const startAnimation = () => {
        if (traversalSequence.length === 0) return;
        
        setIsAnimating(true);
        setCurrentStep(0);
        setSortedValues([]);
        
        // Reset tree to normal state first
        fetchTree();
        
        // Start the step-by-step animation
        animationRef.current = setTimeout(() => {
            animateStep(0);
        }, 1000);
    };

    // Animate each step
    const animateStep = (step) => {
        if (step >= traversalSequence.length) {
            setIsAnimating(false);
            return;
        }

        // Highlight the current node
        const currentValue = traversalSequence[step];
        setHighlightedNode(currentValue);
        fetchTreeWithHighlight(currentValue);
        
        // Add the value to sorted values
        setSortedValues(prev => [...prev, currentValue]);
        
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
        fetchTree(); // Reset tree to normal state
    };

    // Reset the animation
    const resetAnimation = () => {
        stopAnimation();
        setCurrentStep(0);
        setSortedValues([]);
        setHighlightedNode(null);
    };

    useEffect(() => {
        Promise.all([fetchTree(), fetchTraversalSequence()]).finally(() => setLoading(false));
        
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
                    Tri par ABR
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
                                disabled={isAnimating || traversalSequence.length === 0}
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

                        {/* Tree visualization */}
                        {treeData ? (
                            <div className="bg-white p-4 rounded-xl shadow w-full h-[500px] flex items-center justify-center mb-8">
                                <Tree
                                    data={treeData}
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
                            <p className="text-gray-500 mb-8">Aucun arbre à afficher</p>
                        )}

                        {/* Sorted values display */}
                        <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
                            <h2 className="text-lg font-semibold text-green-700 mb-2">
                                Valeurs triées (Parcours Infixe) :
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
                                    Étape {currentStep} sur {traversalSequence.length}
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TriABR;