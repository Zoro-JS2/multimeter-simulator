// src/components/MultimeterDial.tsx
import React, { useState } from 'react';

const positions = [
  { label: 'V', hint: 'Измерение напряжения постоянного тока' },
  { label: 'V~', hint: 'Измерение напряжения переменного тока' },
  { label: 'A', hint: 'Измерение тока' },
  { label: 'Ω', hint: 'Измерение сопротивления' },
];

export const MultimeterDial: React.FC = () => {
  const [selected, setSelected] = useState(positions[0]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Мультиметр</h2>
      <div>
        {positions.map((pos) => (
          <button
            key={pos.label}
            onClick={() => setSelected(pos)}
            style={{
              margin: '0.5rem',
              padding: '1rem',
              border:
                selected.label === pos.label
                  ? '2px solid blue'
                  : '1px solid gray',
            }}
          >
            {pos.label}
          </button>
        ))}
      </div>
      <p>
        <strong>Подсказка:</strong> {selected.hint}
      </p>
    </div>
  );
};
