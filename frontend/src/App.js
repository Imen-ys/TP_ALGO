import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import './App.css';
import {Home, TPOne , ABR , AVL , TASMAX , TASMIN , AMR , GrapheNonOr , GrapheOriente ,
  GraphePondere , GrapheNonPondere , B_ARBER

} from './Compentes/index';

function App() {

  return (
    <div className="App">
        <Router>
          <Routes>
            {/* <Route path='/' element={<NavBar/>}/> */}
            <Route path='/' element={<Home/>}/>
            <Route path='/tp1' element={<TPOne/>}/>
            <Route path='/tp1/ABR' element={<ABR/>}/>
            <Route path='/tp1/AVL' element={<AVL/>}/>
            <Route path='/tp1/TASMIN' element={<TASMIN/>}/>
            <Route path='/tp1/TASMAX' element={<TASMAX/>}/>
            <Route path='/tp1/AMR' element={<AMR/>}/>
            <Route path='/tp1/B_ARBER' element={<B_ARBER/>}/>
            <Route path='/tp1/graphe-non-oriente' element={<GrapheNonOr/>}/>
            <Route path='/tp1/graphe-oriente' element={<GrapheOriente/>}/>
            <Route path='/tp1/graphe-pondere' element={<GraphePondere/>}/>
            <Route path='/tp1/graphe-non-pondere' element={<GrapheNonPondere/>}/>
            {/*<Route path='/tp3' element={<h1>TP3 Page</h1>}/>
            <Route path='/tp4' element={<h1>TP4 Page</h1>}/>
            <Route path='/tp5' element={<h1>TP5 Page</h1>}/>
            <Route path='/tp6' element={<h1>TP6 Page</h1>}/> */}
            {/* <p className="text-lg text-blue-600">Message from backend: {message}</p> */}

          </Routes>
        </Router>
    </div>
  );
}

export default App;
