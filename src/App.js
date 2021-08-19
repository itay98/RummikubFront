import { useState, createContext,useReducer } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./Components/NavBar";
import Container from "./Components/router";
import './App.scss';
export const Context = createContext();
export default function App() {
  const [, render] = useReducer(s => !s);
  const [playing, setPlaying] = useState();
  return (
    <div>
      <Context.Provider value={{ render, playing, setPlaying }}>
        <NavBar />
        <Container />
      </Context.Provider>
    </div>
  );
}