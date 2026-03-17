import React from 'react';
import { MultimeterDial } from './components/MultimeterDial';
import { Multimeter } from './components/Multimeter';

function App() {
  return (
    <div>
      <h1 className='headersite'>Учебный сайт по мультиметру</h1>
      <MultimeterDial />
      <Multimeter />
    </div>
  );
}

export default App;
