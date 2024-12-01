import React from 'react';
import PowerGraph from './componets/PowerGraph.jsx';
function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '20px 0', color: '#007BFF' }}>
        PV Power Monitoring
      </h1>
      <PowerGraph />
    </div>
  );
}

export default App;
