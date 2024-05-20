// src/App.js
import React from 'react';
import BlockVisualizer from './components/BlockVisualizer';
import './App.css';

const blockData = `
  0 0 0   0 1 0   1 0 0   1 1 0   2 0 0   2 1 0
  0 0 0   0 1 0   1 0 0   1 0 1   2 0 0   2 1 0
  0 0 0   0 1 0   1 0 0   1 1 0   2 1 0   2 1 1
  0 0 0   0 1 0   1 2 0   1 1 0   2 0 0   2 1 0
  0 1 1   0 1 0   1 0 0   1 1 0   2 0 0   2 1 0
  0 0 0   0 1 0   1 0 0   1 1 0   2 2 0   2 1 0
  0 2 0   0 1 0   1 1 0   1 1 1   2 0 0   2 1 0
  0 0 0   0 1 0   1 1 1   1 1 0   2 2 0   2 1 0
  0 2 0   0 1 0   1 1 0   1 0 0   2 1 1   2 1 0
  0 0 0   0 1 0   1 2 0   1 1 0   2 1 1   2 1 0
  0 0 0   0 1 0   1 1 1   1 1 0
`;

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>3D Block Puzzle Visualizer</h1>
            </header>
            <BlockVisualizer blockData={blockData} />
        </div>
    );
}

export default App;
