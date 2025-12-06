import logo from './téléchargement.jpg';
import { NavBar } from '../index';

const Home = () => {
    return (
        <div className="text-gray-800">
            <NavBar />

            {/* Section Header */}
            <div className="flex items-center justify-center mt-14 space-x-10">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-28 h-28 rounded-full shadow-md"
                />

                <div className="flex flex-col text-center">
                    <p className="text-xl font-semibold">Université Blida 1</p>
                    <p className="text-gray-600">Faculté des Sciences</p>
                    <p className="text-gray-600">Département d’Informatique</p>
                    <p className="text-gray-700 font-medium">Master IL (Ingénierie Logiciel)</p>
                    <p className="text-gray-600">Semestre 1</p>
                </div>

                <img
                    src={logo}
                    alt="Logo"
                    className="w-28 h-28 rounded-full shadow-md"
                />
            </div>

            {/* Title */}
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-wide drop-shadow-lg">
                    ALGO AV
                </h1>
                <div className="w-32 h-1 bg-gray-700 mt-4 rounded-full"></div>
            </div>

            {/* Group Members */}
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl text-center border border-gray-100">
                <p className="text-2xl font-semibold mb-4 text-gray-900">Groupe 11 :</p>
                
                <div className="flex flex-col space-y-2 text-gray-700 font-medium text-lg">
                    <span>Tafadjira Mohamed Mounir — G1</span>
                    <span>Yousri Imen — G2</span>
                    <span>Khelfat Takieddine — G1</span>
                    <span>Mestoura Abderahmane — G1</span>
                    <span>Zinai Mehdi Malik — G1</span>
                    <span>Yacine Tebbal — G2</span>
                </div>
            </div>

            <div className="h-20"></div>
        </div>
    );
};

export default Home;
