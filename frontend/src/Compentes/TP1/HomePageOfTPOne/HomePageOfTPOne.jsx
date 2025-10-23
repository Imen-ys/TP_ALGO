import {NavBar} from '../../index';

const HomePageOfTPOne = () => {

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8">

      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        Les Graphe
      </h1>


      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="/tp1/graphe-oriente"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Graphe orienté
        </a>
        <a
          href="/tp1/graphe-non-oriente"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Graphe non orienté
        </a>
        <a
          href="/tp1/graphe-pondere"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Graphe pondéré
        </a>
        <a
          href="/tp1/graphe-non-pondere"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Graphe non pondéré
        </a>
      </div> 
    </div>
    </>
  );
};

export default HomePageOfTPOne;