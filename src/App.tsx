import { useState } from 'react';
import { Multimeter } from './components/Multimeter';
import { Workspace } from './components/Workspace';
import { type ProbeColor, type ProbeConnections } from './types';

function App() {
  const [connections, setConnections] = useState<ProbeConnections>({
    red: null,
    black: null,
  });

  const handleConnectProbe = (color: ProbeColor, portId: string | null) => {
    setConnections(prev => ({
      ...prev,
      [color]: portId
    }));
  };

  return (
    <div className="app-main-layout">
      <header className="app-header">
        <h1>Digital Multimeter Simulator</h1>
        <p>Перетягивайте щупы из док-станции на предметы для измерения</p>
      </header>
      
      <main className="app-content">
        <div className="multimeter-side">
          <Multimeter connections={connections} />
        </div>
        
        <div className="workspace-side">
          <Workspace connections={connections} onConnectProbe={handleConnectProbe} />
        </div>
      </main>
    </div>
  );
}

export default App;
