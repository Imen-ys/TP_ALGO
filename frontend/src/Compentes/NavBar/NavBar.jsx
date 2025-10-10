const NavBar = () => {
  return (
    <div className="fixed top-0 left-0 w-52 h-screen bg-green-600 p-4">
      <ul className="flex flex-col space-y-2 text-white">
        <li>
          <a className="block py-2 px-3 rounded hover:bg-green-700" href="/">Home</a>
        </li>
        <li>
          <a className="block py-2 px-3 rounded hover:bg-green-700" href="/tp1">TP1</a>
        </li>
        <li>
          <a className="block py-2 px-3 rounded hover:bg-green-700" href="/tp2">TP2</a>
        </li>
        <li>
          <a className="block py-2 px-3 rounded hover:bg-green-700" href="/tp3">TP3</a>
        </li>
        <li>
          <a className="block py-2 px-3 rounded hover:bg-green-700" href="/tp4">TP4</a>
        </li>
        <li>
          <a className="block py-2 px-3 rounded hover:bg-green-700" href="/tp5">TP5</a>
        </li>
        <li>
          <a className="block py-2 px-3 rounded hover:bg-green-700" href="/tp6">TP6</a>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
