import './App.css';
import Monsters from './Monsters';
import StatBlock from './StatBlock';
import { useState, useEffect } from 'react';

function App() {
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="App">
      <h1>Monsters SRD 5.1</h1>
      <input
        type="text"
        placeholder="モンスターを検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: '10px', padding: '5px', width: '200px' }}
      />
      <div className="AppBody">
        <Monsters selectedMonsterProc={setSelectedMonster} searchTerm={searchTerm} />
        <div className="StatBlockContainer">
          {/* <label><input type="checkbox"></input>別ウィンドウで表示</label> */}
          <StatBlock selectedMonster={selectedMonster} />
        </div>
      </div>
    </div>
  );
}

export default App;
