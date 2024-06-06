// src/App.js
import React from 'react';
import BlockVisualizer from './components/BlockVisualizer';
import './App.css';

const blockData = `
0 1 3   0 2 3   0 2 4   0 3 2   0 3 3
0 0 1   0 0 2   0 0 3   0 0 4   0 0 5
2 0 3   3 0 0   3 0 1   3 0 2   3 0 3
1 0 2   1 0 3   2 0 0   2 0 1   2 0 2
0 0 0   0 1 0   1 0 0   1 1 0   2 1 0
1 3 0   2 3 0   2 3 1   2 3 2   3 3 0
0 1 4   0 1 5   0 2 5   0 3 4   0 3 5
1 3 1   1 3 2   1 3 3   2 3 3   3 3 3
0 1 2   0 2 1   0 2 2   0 3 0   0 3 1
0 1 1   1 0 1   1 1 1   1 2 1   2 1 1
0 2 0   1 2 0   2 2 0   2 2 1   3 2 0
3 1 0   3 1 1   3 2 1   3 3 1   3 3 2
`;

function App() {
    return (
        <div className="App">
           
            <BlockVisualizer blockData={blockData} />
        </div>
    );
}

export default App;
