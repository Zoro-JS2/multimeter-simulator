import React, { useState } from 'react';
import { type ProbeConnections } from '../types';

type Position = {
  label: string;
  hint: string;
  angle: number;
  correctConnector: string;
};

const positions: Position[] = [
  { label: 'OFF', hint: 'Выключено', angle: -90, correctConnector: '' },
  { label: 'V~', hint: 'Измерение переменного напряжения', angle: -50, correctConnector: 'VΩmA' },
  { label: 'V⎓', hint: 'Измерение постоянного напряжения', angle: -10, correctConnector: 'VΩmA' },
  { label: 'A', hint: 'Измерение силы тока', angle: 30, correctConnector: '10A' },
  { label: 'Ω', hint: 'Измерение сопротивления', angle: 70, correctConnector: 'VΩmA' },
  { label: '🔔', hint: 'Прозвонка цепи', angle: 110, correctConnector: 'VΩmA' },
];

interface MultimeterProps {
  connections: ProbeConnections;
}

export const Multimeter: React.FC<MultimeterProps> = ({ connections }) => {
  const [selected, setSelected] = useState<Position>(positions[0]);
  const [plusConnector, setPlusConnector] = useState<string>('VΩmA');
  const [minusConnector, setMinusConnector] = useState<string>('COM');

  // Validate internal ports
  const isCorrectPorts =
    selected.label === 'OFF' ||
    (minusConnector === 'COM' && plusConnector === selected.correctConnector);

  const r = connections.red;
  const b = connections.black;
  const isSocket = (r === 'socket-l' && b === 'socket-n') || (r === 'socket-n' && b === 'socket-l');
  const isBatteryFwd = r === 'battery-plus' && b === 'battery-minus';
  const isBatteryRev = r === 'battery-minus' && b === 'battery-plus';
  const isResistor = (r === 'resistor-a' && b === 'resistor-b') || (r === 'resistor-b' && b === 'resistor-a');
  const isWire = (r === 'wire-a' && b === 'wire-b') || (r === 'wire-b' && b === 'wire-a');
  const isAmp = (r === 'amp-a' && b === 'amp-b') || (r === 'amp-b' && b === 'amp-a'); // For simplicity
  const isAmpRev = r === 'amp-b' && b === 'amp-a';

  // Measure logic based on Workspace connections
  let measuredValue = '';
  let errorMessage: string | null = null;

  if (selected.label !== 'OFF') {
    if (!isCorrectPorts) {
      if (minusConnector !== 'COM') {
        errorMessage = 'Ошибка: Чёрный щуп всегда должен быть в разъёме COM (-)';
      } else {
        errorMessage = `Ошибка: Красный щуп должен быть в ${selected.correctConnector} для режима ${selected.label}`;
      }
    } else {
      // Ports are correct on the device. Check objects.
      if (r || b) {
        if (r && !b) errorMessage = 'Подключите чёрный щуп для замыкания цепи.';
        else if (!r && b) errorMessage = 'Подключите красный щуп для замыкания цепи.';
        else if (r?.split('-')[0] !== b?.split('-')[0]) errorMessage = 'Щупы подключены к разным предметам!';
        else {
          // Both probes on the same object
          const isOnSocket = r?.startsWith('socket');
          const isOnBattery = r?.startsWith('battery');
          const isOnResistor = r?.startsWith('resistor');
          const isOnWire = r?.startsWith('wire');
          const isOnAmp = r?.startsWith('amp');

          switch (selected.label) {
            case 'V~':
              if (isSocket) measuredValue = '220.5';
              else if (!isOnSocket) errorMessage = 'Режим V~ (AC) измеряет переменный ток (например, розетку).';
              break;
            case 'V⎓':
              if (isBatteryFwd) measuredValue = '12.4';
              else if (isBatteryRev) measuredValue = '-12.4';
              else if (!isOnBattery) errorMessage = 'Режим V⎓ (DC) измеряет постоянный ток (например, батарейки).';
              break;
            case 'A':
              if (isAmp) measuredValue = '0.45';
              else if (isAmpRev) measuredValue = '-0.45';
              else if (!isOnAmp) errorMessage = 'Ток измеряется в РАЗРЫВЕ цепи (нагрузке). Вызовет КЗ!';
              break;
            case 'Ω':
              if (isResistor) measuredValue = '10.0 k';
              else if (isWire) measuredValue = '0.00';
              else if (!isOnResistor && !isOnWire) errorMessage = 'Режим Ом (Ω) для измерения сопротивления (резисторы).';
              break;
            case '🔔':
              if (isWire) measuredValue = 'BEEP';
              else if (isResistor) measuredValue = '10.0 k';
              else if (!isOnWire && !isOnResistor) errorMessage = 'Прозвонка ищет замкнутые цепи (проводники).';
              break;
          }
        }
      }
    }
  }

  const renderPorts = (name: string, current: string, onChange: (v: string) => void, isBlack: boolean) => (
    <div className="ports-row">
      {['10A', 'COM', 'VΩmA'].map((port) => (
        <label className="port-label" key={port}>
          <input
            type="radio"
            name={name}
            value={port}
            checked={current === port}
            onChange={(e) => onChange(e.target.value)}
            className={`port-input ${isBlack ? 'black-probe' : ''}`}
          />
          <div className="port-hole"></div>
          <span>{port}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="multimeter-device" style={{ position: 'sticky', top: '2rem' }}>
      {/* LCD Screen */}
      <div className={`lcd-screen ${errorMessage ? 'error' : ''}`}>
        <div className="lcd-value">
          {selected.label === 'OFF' ? '' : !errorMessage && measuredValue ? measuredValue : '----'}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {errorMessage}
        </div>
      )}

      {/* Dial Section */}
      <div className="dial-container">
        <div className="dial-labels">
          {positions.map((pos) => {
            const rad = ((pos.angle - 90) * Math.PI) / 180;
            const r = 115;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            
            return (
              <div
                key={pos.label}
                className={`dial-label ${selected.label === pos.label ? 'active' : ''}`}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
                onClick={() => setSelected(pos)}
              >
                {pos.label}
              </div>
            );
          })}
        </div>
        
        <div 
          className="dial-knob"
          style={{ transform: `rotate(${selected.angle}deg)` }}
        >
          <div className="dial-indicator"></div>
        </div>
      </div>

      <div className="hint-message">
        {selected.hint}
      </div>

      {/* Ports Section */}
      <div className="ports-section">
        <div className="port-group">
          <h3>Разъём черного кабеля (-)</h3>
          {renderPorts('minus', minusConnector, setMinusConnector, true)}
        </div>
        
        <div className="port-group">
          <h3>Разъём красного кабеля (+)</h3>
          {renderPorts('plus', plusConnector, setPlusConnector, false)}
        </div>
      </div>
    </div>
  );
};
