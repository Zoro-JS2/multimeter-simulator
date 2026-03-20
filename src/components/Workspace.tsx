import React, { useState } from 'react';
import { type ProbeColor, type ProbeConnections } from '../types';

interface ProbeProps {
  color: ProbeColor;
}

const ProbeItem: React.FC<ProbeProps> = ({ color }) => {
  return (
    <div
      className={`probe-tip ${color}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('probeColor', color);
      }}
    >
      <div className="probe-metal"></div>
    </div>
  );
};

interface DropzoneProps {
  id: string;
  label: string;
  connections: ProbeConnections;
  onConnect: (color: ProbeColor, portId: string | null) => void;
  className?: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ id, label, connections, onConnect, className = '' }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const color = e.dataTransfer.getData('probeColor') as ProbeColor;
    if (color === 'red' || color === 'black') {
      onConnect(color, id);
    }
  };

  const hasRed = connections.red === id;
  const hasBlack = connections.black === id;

  const handleClick = () => {
    if (hasRed) onConnect('red', null);
    if (hasBlack) onConnect('black', null);
  };

  return (
    <div
      className={`dropzone ${isOver ? 'drag-over' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      title="Нажмите, чтобы отключить щуп"
    >
      <div className="dropzone-label">{label}</div>
      <div className="dropzone-pockets">
        {(hasRed || hasBlack) ? (
          <>
            {hasRed && <ProbeItem color="red" />}
            {hasBlack && <ProbeItem color="black" />}
          </>
        ) : (
          <div className="empty-hole"></div>
        )}
      </div>
    </div>
  );
};

interface WorkspaceProps {
  connections: ProbeConnections;
  onConnectProbe: (color: ProbeColor, portId: string | null) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ connections, onConnectProbe }) => {
  const handleDockDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const color = e.dataTransfer.getData('probeColor') as ProbeColor;
    if (color === 'red' || color === 'black') {
      onConnectProbe(color, null);
    }
  };

  return (
    <div className="workspace-container">
      <h2>Рабочая зона (Испытательный стенд)</h2>
      
      <div className="test-objects-grid">
        {/* Socket */}
        <div className="test-object obj-socket">
          <h3>Розетка (220V AC)</h3>
          <div className="drops-row">
            <Dropzone id="socket-l" label="Фаза" connections={connections} onConnect={onConnectProbe} className="dz-socket" />
            <Dropzone id="socket-n" label="Ноль" connections={connections} onConnect={onConnectProbe} className="dz-socket" />
          </div>
        </div>

        {/* Battery */}
        <div className="test-object obj-battery">
          <h3>Батарейка (12V DC)</h3>
          <div className="battery-body">
            <Dropzone id="battery-plus" label="+" connections={connections} onConnect={onConnectProbe} className="dz-battery top" />
            <div className="battery-label">12V</div>
            <Dropzone id="battery-minus" label="-" connections={connections} onConnect={onConnectProbe} className="dz-battery bottom" />
          </div>
        </div>

        {/* Resistor */}
        <div className="test-object obj-resistor">
          <h3>Резистор (10kΩ)</h3>
          <div className="resistor-body">
            <Dropzone id="resistor-a" label="" connections={connections} onConnect={onConnectProbe} className="dz-small" />
            <div className="resistor-stripes"></div>
            <Dropzone id="resistor-b" label="" connections={connections} onConnect={onConnectProbe} className="dz-small" />
          </div>
        </div>

        {/* Wire (Continuity) */}
        <div className="test-object obj-wire">
          <h3>Проводник (Прозвонка)</h3>
          <div className="wire-body">
            <Dropzone id="wire-a" label="" connections={connections} onConnect={onConnectProbe} className="dz-small" />
            <div className="wire-line"></div>
            <Dropzone id="wire-b" label="" connections={connections} onConnect={onConnectProbe} className="dz-small" />
          </div>
        </div>

        {/* Bulb Circuit (Amps) */}
        <div className="test-object obj-bulb">
          <h3>Цепь лампы (Ток)</h3>
          <div className="circuit-body">
            <div className="circuit-bat">[ Батарея ]</div>
            <div className="circuit-wire top"></div>
            <div className="circuit-bulb">💡</div>
            <div className="circuit-break">
              <Dropzone id="amp-a" label="In" connections={connections} onConnect={onConnectProbe} className="dz-small" />
              <div className="break-gap">РАЗРЫВ ЦЕПИ</div>
              <Dropzone id="amp-b" label="Out" connections={connections} onConnect={onConnectProbe} className="dz-small" />
            </div>
            <div className="circuit-wire bottom"></div>
          </div>
        </div>
      </div>

      <div 
        className="probes-dock"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDockDrop}
      >
        <div className="dock-title">Док-станция щупов (перетяните сюда для сброса)</div>
        <div className="dock-slots">
          {connections.black === null && (
            <div className="dock-slot">
              <span className="slot-label">COM</span>
              <ProbeItem color="black" />
            </div>
          )}
          {connections.red === null && (
            <div className="dock-slot">
              <span className="slot-label">+</span>
              <ProbeItem color="red" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
