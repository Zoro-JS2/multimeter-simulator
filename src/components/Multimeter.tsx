// src/components/Multimeter.tsx
import React, { useState } from 'react';

type Position = {
  label: string;
  hint: string;
  angle: number;
  value?: string;
  correctConnector: string;
};

const positions: Position[] = [
  {
    label: 'OFF',
    hint: 'Выключено',
    angle: 0,
    value: '',
    correctConnector: '',
  },
  {
    label: 'V~',
    hint: 'Измерение переменного напряжения',
    angle: 45,
    value: '220 V',
    correctConnector: 'VΩmA',
  },
  {
    label: 'V⎓',
    hint: 'Измерение постоянного напряжения',
    angle: 90,
    value: '12 V',
    correctConnector: 'VΩmA',
  },
  {
    label: 'A',
    hint: 'Измерение силы тока',
    angle: 135,
    value: '1.2 A',
    correctConnector: '10A',
  },
  {
    label: 'Ω',
    hint: 'Измерение сопротивления',
    angle: 180,
    value: '10 kΩ',
    correctConnector: 'VΩmA',
  },
  {
    label: '🔔',
    hint: 'Прозвонка цепи',
    angle: 225,
    value: 'BEEP',
    correctConnector: 'VΩmA',
  },
];

export const Multimeter: React.FC = () => {
  const [selected, setSelected] = useState<Position>(positions[0]);
  const [plusConnector, setPlusConnector] = useState<string>('VΩmA');
  const [minusConnector, setMinusConnector] = useState<string>('COM');

  const isCorrect =
    selected.label === 'OFF' ||
    (minusConnector === 'COM' && plusConnector === selected.correctConnector);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Мультиметр</h2>

      {/* Экран */}
      <div
        style={{
          width: '200px',
          height: '50px',
          margin: '1rem auto',
          border: '2px solid black',
          background: 'lightgreen',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected.label === 'OFF' ? '' : isCorrect ? selected.value : 'ERROR'}
      </div>

      {/* Круг с режимами */}
      <svg width='300' height='300' viewBox='0 0 300 300'>
        <circle
          cx='150'
          cy='150'
          r='120'
          stroke='black'
          strokeWidth='3'
          fill='lightgray'
        />

        {positions.map((pos, i) => {
          const rad = (pos.angle * Math.PI) / 180;
          const x = 150 + Math.cos(rad) * 95;
          const y = 150 + Math.sin(rad) * 95;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor='middle'
              dominantBaseline='middle'
              style={{
                cursor: 'pointer',
                fontWeight: selected.label === pos.label ? 'bold' : 'normal',
              }}
              onClick={() => setSelected(pos)}
            >
              {pos.label}
            </text>
          );
        })}

        <line
          x1='150'
          y1='150'
          x2={150 + Math.cos((selected.angle * Math.PI) / 180) * 70}
          y2={150 + Math.sin((selected.angle * Math.PI) / 180) * 70}
          stroke='red'
          strokeWidth='4'
        />
      </svg>

      {/* Коннекторы */}
      <div style={{ marginTop: '1rem' }}>
        <p>
          <strong>Минусовой щуп (-):</strong>
        </p>
        <label>
          <input
            type='radio'
            name='minus'
            value='COM'
            checked={minusConnector === 'COM'}
            onChange={(e) => setMinusConnector(e.target.value)}
          />
          COM
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type='radio'
            name='minus'
            value='VΩmA'
            checked={minusConnector === 'VΩmA'}
            onChange={(e) => setMinusConnector(e.target.value)}
          />
          VΩmA
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type='radio'
            name='minus'
            value='10A'
            checked={minusConnector === '10A'}
            onChange={(e) => setMinusConnector(e.target.value)}
          />
          10A
        </label>

        <p style={{ marginTop: '1rem' }}>
          <strong>Плюсовой щуп (+):</strong>
        </p>
        <label>
          <input
            type='radio'
            name='plus'
            value='COM'
            checked={plusConnector === 'COM'}
            onChange={(e) => setPlusConnector(e.target.value)}
          />
          COM
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type='radio'
            name='plus'
            value='VΩmA'
            checked={plusConnector === 'VΩmA'}
            onChange={(e) => setPlusConnector(e.target.value)}
          />
          VΩmA
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type='radio'
            name='plus'
            value='10A'
            checked={plusConnector === '10A'}
            onChange={(e) => setPlusConnector(e.target.value)}
          />
          10A
        </label>
      </div>

      {/* Подсказка */}
      <p>
        <strong>Подсказка:</strong> {selected.hint}
      </p>

      {/* Ошибка */}
      {!isCorrect && selected.label !== 'OFF' && (
        <p style={{ color: 'red' }}>
          ❌ Неправильное подключение! Минусовой щуп должен быть в{' '}
          <strong>COM</strong>, а плюсовой — в{' '}
          <strong>{selected.correctConnector}</strong>.
        </p>
      )}
    </div>
  );
};
