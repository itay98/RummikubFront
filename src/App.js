import { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Container from "./Components/router";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
const Game = lazy(() => import('./Pages/Game'));
function App() {
  
  return (
    <div>
      <Suspense fallback={<div></div>}> <Switch>
        <Route exact path="/game" component={Game} />
        <Route component={() => <><NavBar /><Container /></>} />
      </Switch></Suspense>
    </div>
  );
}

export default App;