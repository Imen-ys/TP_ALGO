import { NavBar, HomePageOfTP3 } from "../../index";
import { useState, useEffect } from "react";

const TriTASMIN = () => {
    const [TriData, setTriData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTree = async () => {
    try {
        const res = await fetch("http://127.0.0.1:5000/TriTASMIN/show");
        const data = await res.json();
        setTriData(data);
    } catch (err) {
        setError("Erreur lors du chargement du tri TASMIN");
    }
    };

    useEffect(() => {
    Promise.all([fetchTree()]).finally(() => setLoading(false));
    }, []);

return (
    <div>
        <NavBar />
        <HomePageOfTP3 />

        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
            <h1 className="text-3xl font-bold text-green-700 mb-6">
            Tri par TASMIN
        </h1>

        {loading ? (
            <p className="text-gray-500">Chargement...</p>
        ) : error ? (
            <p className="text-red-500">{error}</p>
        ) : TriData && TriData.sorted_values?.length > 0 ? (
            <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-green-700 mb-2">
                Valeurs triées :
            </h2>
            <p className="text-gray-700 mb-4">
                {TriData.sorted_values.join(", ")}
            </p>
            <p className="text-sm text-gray-500">
                Temps d'exécution : {TriData.execution_time_ms} ms
            </p>
            </div>
        ) : (
            <p className="text-gray-500">Aucune donnée disponible</p>
        )}
        </div>
    </div>
    );
};

export default TriTASMIN;
