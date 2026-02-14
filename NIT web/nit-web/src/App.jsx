import React from 'react';
import Header from './Components/Header';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Translator from './pages/Translator';


const App = () => {
  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        {/* You can add more routes here like:
        <Route path='/about' element={<About />} />
        */}
        <Route path='/translator' element={<Translator/>}/>
      </Routes>
    </div>
  );
};

export default App;
