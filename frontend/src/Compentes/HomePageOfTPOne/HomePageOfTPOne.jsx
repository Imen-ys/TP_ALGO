
const HomePageOfTPOne = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8">

      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        Les Arbres
      </h1>

      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        <a
          href="/tp1/abr"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow hover:bg-green-700 transition"
        >
          ABR
        </a>
        <a
          href="/tp1/avl"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow hover:bg-green-700 transition"
        >
          AVL
        </a>
        <a
          href="/tp1/tasmin"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow hover:bg-green-700 transition"
        >
          TASMIN
        </a>
        <a
          href="/tp1/tasmax"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow hover:bg-green-700 transition"
        >
          TASMAX
        </a>
        <a
          href="/tp1/amr"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow hover:bg-green-700 transition"
        >
          AMR
        </a>
        <a
          href="/tp1/B_ARBER"
          className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow hover:bg-green-700 transition"
        >
          B_ARBER
        </a>
      </div>

      <h2 className="text-3xl font-semibold text-green-700 mb-6 text-center">
        Les Graphes
      </h2>

      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="/tp1/graphe-oriente"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition"
        >
          Graphe orienté
        </a>
        <a
          href="/tp1/graphe-non-oriente"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition"
        >
          Graphe non orienté
        </a>
        <a
          href="/tp1/graphe-pondere"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition"
        >
          Graphe pondéré
        </a>
        <a
          href="/tp1/graphe-non-pondere"
          className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition"
        >
          Graphe non pondéré
        </a>
      </div>
    </div>
  );
};

export default HomePageOfTPOne;
