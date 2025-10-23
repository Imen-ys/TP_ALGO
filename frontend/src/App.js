import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import './App.css';
import {Home , ABR , AVL , TASMAX , TASMIN , AMR , GrapheNonOr , GrapheOriente ,
  GraphePondere , GrapheNonPondere , B_ARBER , HomePageOfTPOne , HomePageOfTP2 , HomePageOfTP3 , TriABR,
  TriAVL


} from './Compentes/index';

function App() {

  return (
    <div className="App">
        <Router>
          <Routes>
            {/* <Route path='/' element={<NavBar/>}/> */}
            <Route path='/' element={<Home/>}/>

            <Route path='/tp1' element={<HomePageOfTPOne/>}/>
            <Route path='/tp1/graphe-non-oriente' element={<GrapheNonOr/>}/>
            <Route path='/tp1/graphe-oriente' element={<GrapheOriente/>}/>
            <Route path='/tp1/graphe-pondere' element={<GraphePondere/>}/>
            <Route path='/tp1/graphe-non-pondere' element={<GrapheNonPondere/>}/>

            <Route path='/tp2' element={<HomePageOfTP2/>}/>
            <Route path='/tp2/ABR' element={<ABR/>}/>
            <Route path='/tp2/AVL' element={<AVL/>}/>
            <Route path='/tp2/TASMIN' element={<TASMIN/>}/>
            <Route path='/tp2/TASMAX' element={<TASMAX/>}/>

            <Route path='/tp3' element={<HomePageOfTP3/>}/>
            <Route path='/tp3/Triabr' element={<TriABR/>}/>
            <Route path='/tp3/Triavl' element={<TriAVL/>}/>


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
