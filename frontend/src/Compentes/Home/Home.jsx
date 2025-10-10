import logo from './téléchargement.jpg';
import {NavBar} from '../index';
const Home = () => {
    return (
        <div>
            <NavBar/>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="mb-6">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-24 h-24 object-contain"
                />
            </div>

            <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
                ALGO AV
            </h1>
            </div>
        </div>
        

    );
}

export default Home;
