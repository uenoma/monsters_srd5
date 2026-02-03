import './App.css';
import Monsters from './Monsters';
import StatBlock from './StatBlock';
import { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

function MonsterDetail() {
  const { index } = useParams();
  const [monsterDetails, setMonsterDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://www.dnd5eapi.co/api/2014/monsters/${index}`)
      .then(response => response.json())
      .then(data => {
        setMonsterDetails(data);
        document.title = data.name;
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [index]);

  if (loading) return <div>Loading...</div>;
  if (!monsterDetails) return <div>No data</div>;

  return (
    <div className="App MonsterDetail">
      <StatBlock selectedMonster={{ index }} />
    </div>
  );
}

function App() {
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Routes>
      <Route path="/monster/:index" element={<MonsterDetail />} />
      <Route path="/" element={
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
              <StatBlock selectedMonster={selectedMonster} />
              {selectedMonster &&
                <button onClick={() => window.open(`#/monster/${selectedMonster.index}`, '_blank')}>印刷用に別ウィンドウで表示</button>
              }
            </div>
          </div>
          <div className='AppPolicy Print-None'>
            <p>This work includes material taken from the System Reference Document 5.1 ("SRD 5.1")<br />
              by Wizards of the Coast LLC and available at:<br />
              <a href="https://dnd.wizards.com/resources/systems-reference-document" target="_blank" rel="noopener noreferrer">https://dnd.wizards.com/resources/systems-reference-document</a></p>
            <p>The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License:<br />
              <a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noopener noreferrer">https://creativecommons.org/licenses/by/4.0/legalcode</a></p>
          </div>

        </div>
      } />
    </Routes>
  );
}

export default App;
