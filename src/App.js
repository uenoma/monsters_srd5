import './App.css';
import Monsters from './Monsters';
import StatBlock from './StatBlock';
import { useState, useEffect } from 'react';

function App() {
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [monsterDetails, setMonsterDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedMonster) {
      fetch(`https://www.dnd5eapi.co/api/2014/monsters/${selectedMonster.index}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setMonsterDetails(data);
        })
        .catch(err => console.error(err));
    } else {
      setMonsterDetails(null);
    }
  }, [selectedMonster]);

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
        <Monsters selectedMonsterProc={setSelectedMonster} searchTerm={searchTerm}/>
        <StatBlock monsterDetails={monsterDetails} />
      </div>
    </div>
  );
}

export default App;
