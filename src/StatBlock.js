import './StatBlock.css';
import { useState, useEffect } from 'react';

function StatBlock(props) {

  const [monsterDetails, setMonsterDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.selectedMonster) {
      setLoading(true);
      fetch(`https://www.dnd5eapi.co/api/2014/monsters/${props.selectedMonster.index}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setMonsterDetails(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setMonsterDetails(null);
    }
  }, [props.selectedMonster]);

  const abilityMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    if (mod >= 0) {
      return "+" + mod;
    } else if (mod === 0) {
      return "±" + mod;
    }
    return mod;
  }

  const savingThrows = () => {
    const abilityMap = {
      'STR': '【筋】',
      'DEX': '【敏】',
      'CON': '【耐】',
      'INT': '【知】',
      'WIS': '【判】',
      'CHA': '【魅】'
    };
    if (monsterDetails.proficiencies) {
      const saves = monsterDetails.proficiencies.filter(p => p.proficiency.name.includes('Saving Throw'));
      return saves.map(p => {
        const abbr = p.proficiency.name.replace('Saving Throw: ', '');
        return (abilityMap[abbr] || abbr) + ' +' + p.value;
      }).join(', ');
    }
    return '-';
  };

  const skills = () => {
    if (monsterDetails.proficiencies) {
      const skillList = monsterDetails.proficiencies.filter(p => p.proficiency.name.includes('Skill'));
      return skillList.map(p => p.proficiency.name.replace('Skill: ', '') + ' +' + p.value).join(', ');
    }
    return '-';
  };

  const damageResistances = () => {
    let result = []

    if (monsterDetails.damage_vulnerabilities && monsterDetails.damage_vulnerabilities.length > 0) {
      result.push(<li><label>ダメージ脆弱性:</label>{monsterDetails.damage_vulnerabilities.join(', ')}</li>);
    }

    if (monsterDetails.damage_resistances && monsterDetails.damage_resistances.length > 0) {
      result.push(<li><label>ダメージ抵抗:</label>{monsterDetails.damage_resistances.join(', ')}</li>);
    }

    if (monsterDetails.damage_immunities && monsterDetails.damage_immunities.length > 0) {
      result.push(<li><label>ダメージ完全耐性:</label>{monsterDetails.damage_immunities.join(', ')}</li>);
    }

    if (monsterDetails.condition_immunities && monsterDetails.condition_immunities.length > 0) {
      result.push(<li><label>状態完全耐性:</label>{monsterDetails.condition_immunities.map(ci => ci.name).join(', ')}</li>);
    }

    return result
  }

  const note = () => {
    if (monsterDetails.legendary_actions && monsterDetails.legendary_actions.length > 0) {
      return (
        <div className="StatBlockBody Right">
          <label>伝説的アクション</label>
          <hr></hr>
          <div className="StatBlockSpecs">
            {monsterDetails.legendary_actions.map((action, idx) => (
              <div key={idx}>
                <strong>{action.name}:</strong> {action.desc}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  if (!props.selectedMonster) {
    return <></>;
  }

  if (loading) {
    return <div className="StatBlock">Loading...</div>;
  }

  if (error) {
    return <div className="StatBlock">Error: {error}</div>;
  }

  if (!monsterDetails) {
    return <div className="StatBlock">No data</div>;
  }

  return (
    <div className="StatBlock">
      <div className="StatBlockBody">
        <div className="StatBlockHeader">
          <li>{monsterDetails.name}</li>
          <div className="StatBlockHeaderInfo">
            <div>{monsterDetails.size}</div>・
            <div>{monsterDetails.type}</div>、
            <div>{monsterDetails.alignment}</div>
          </div>
        </div>

        <hr></hr>

        <div className="StatBlockSpecs">
          <li><label>AC:</label>{monsterDetails.armor_class ? monsterDetails.armor_class[0].value : ''} {monsterDetails.armor_class && monsterDetails.armor_class[0].type ? "（" + monsterDetails.armor_class[0].type + "）" : ""}</li>
          <li><label>hp:</label>{monsterDetails.hit_points} {"（" + monsterDetails.hit_points_roll + "）"}</li>
          <li><label>移動速度:</label>{Object.entries(monsterDetails.speed).map(([key, value]) => `${key === 'walk' ? '' : key + ' '}${value} `).join(', ')}</li>
        </div>

        <hr className="thin-hr"></hr>

        <div className="StatBlockAbilitys">
          <li><label>【筋】</label><br></br>{monsterDetails.strength} {"(" + abilityMod(monsterDetails.strength) + ")"}</li>
          <li><label>【敏】</label><br></br>{monsterDetails.dexterity} {"(" + abilityMod(monsterDetails.dexterity) + ")"}</li>
          <li><label>【耐】</label><br></br>{monsterDetails.constitution} {"(" + abilityMod(monsterDetails.constitution) + ")"}</li>
          <li><label>【知】</label><br></br>{monsterDetails.intelligence} {"(" + abilityMod(monsterDetails.intelligence) + ")"}</li>
          <li><label>【判】</label><br></br>{monsterDetails.wisdom} {"(" + abilityMod(monsterDetails.wisdom) + ")"}</li>
          <li><label>【魅】</label><br></br>{monsterDetails.charisma} {"(" + abilityMod(monsterDetails.charisma) + ")"}</li>
        </div>

        <hr className="thin-hr"></hr>

        <div className="StatBlockSpecs">
          {savingThrows() && savingThrows() !== '-' && <li><label>セーヴ:</label>{savingThrows()}</li>}
          {skills() && skills() !== '-' && <li><label>技能:</label>{skills()}</li>}
          {damageResistances()}
          <li><label>感覚:</label>{monsterDetails.senses ? Object.entries(monsterDetails.senses).map(([key, value]) => `${key} ${value}`).join(', ') : "-"}</li>
          <li><label>言語:</label>{monsterDetails.languages ? monsterDetails.languages : "-"}</li>
          <li><label>脅威度:</label>{monsterDetails.challenge_rating}（{(monsterDetails.xp || 0).toLocaleString()} XP）</li>
        </div>

        <hr></hr>

        <div className="StatBlockSpecs">
          {monsterDetails.special_abilities ? monsterDetails.special_abilities.map((ability, idx) => (
            <div key={idx}>
              <strong>{ability.name}:</strong> {ability.desc}
            </div>
          )) : null}
        </div>

        <label>アクション</label>
        <hr className="thin-hr"></hr>

        <div className="StatBlockSpecs">
          {monsterDetails.actions ? monsterDetails.actions.map((action, idx) => (
            <p key={idx}>
              <strong>{action.name}:</strong> {action.desc}
            </p>
          )) : null}
        </div>

        {monsterDetails.reactions && monsterDetails.reactions.length > 0 && (
          <>
            <label>リアクション</label>
            <hr className="thin-hr"></hr>
            <div className="StatBlockSpecs">
              {monsterDetails.reactions.map((reaction, idx) => (
                <p key={idx}>
                  <strong>{reaction.name}:</strong> {reaction.desc}
                </p>
              ))}
            </div>
          </>
        )}

      </div>
      {note()}
    </div>
  );
}

export default StatBlock;
