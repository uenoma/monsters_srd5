import './Monsters.css';
import { useState, useEffect } from 'react';

function Monsters(props) {
  const [groupedMonsters, setGroupedMonsters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openGroups, setOpenGroups] = useState({});

  const { searchTerm } = props;


  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/2014/monsters')
      .then(response => response.json())
      .then(data => {
        const grouped = data.results.reduce((acc, monster) => {
          const firstLetter = monster.name.charAt(0).toUpperCase();
          if (!acc[firstLetter]) acc[firstLetter] = [];
          acc[firstLetter].push(monster);
          return acc;
        }, {});
        setGroupedMonsters(grouped);
        const initialOpen = Object.keys(grouped).reduce((acc, letter) => {
          acc[letter] = true;
          return acc;
        }, {});
        setOpenGroups(initialOpen);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const toggleGroup = (letter) => {
    setOpenGroups(prev => ({
      ...prev,
      [letter]: !prev[letter]
    }));
  };

  const openAllGroups = () => {
    const allOpen = Object.keys(groupedMonsters).reduce((acc, letter) => {
      acc[letter] = true;
      return acc;
    }, {});
    setOpenGroups(allOpen);
  };

  const closeAllGroups = () => {
    const allClosed = Object.keys(groupedMonsters).reduce((acc, letter) => {
      acc[letter] = false;
      return acc;
    }, {});
    setOpenGroups(allClosed);
  };

  const filteredGrouped = Object.keys(groupedMonsters).reduce((acc, letter) => {
    const filtered = groupedMonsters[letter].filter(monster =>
      monster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[letter] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="Monsters">
      <div className="group-controls">
        <button onClick={openAllGroups}>すべて開く</button>
        <button onClick={closeAllGroups}>すべて閉じる</button>
      </div>
      <div className='MonstersBody'>
        {Object.keys(filteredGrouped).sort().map(letter => (
          <div key={letter} className="monster-group">
            <h2 onClick={() => toggleGroup(letter)} style={{ cursor: 'pointer' }}>
              {letter} {openGroups[letter] ? '▼' : '▶'}
            </h2>
            {openGroups[letter] && (
              <ul>
              {filteredGrouped[letter].map(monster => (
                <li key={monster.index}>
                  <button onClick={() => props.selectedMonsterProc(monster)}>{monster.name}</button>
                </li>
              ))}
            </ul>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}

export default Monsters;
