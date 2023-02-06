import './App.scss';
import { First } from './pages/first';
import React, {useEffect} from 'react';
import {Nav} from './components/Nav_bar';
import { Home } from './pages/home';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/login';
import Map from './pages/map';
import Start from './pages/start';
import Setloc from './pages/setloc';
import Mapcopy from './components/mapSearch/mapcopy';
function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/map" element={<Map/>}></Route>
        <Route path="/start" element={<Start/>}></Route>
        <Route path="/setloc" element={<Setloc />}></Route>
        <Route path="/mapcopy" element={<Mapcopy/>}></Route>

      </Routes>
    </div>
  );
}

export default App;
