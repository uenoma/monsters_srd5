import './StatBlock.css';

function StatBlock(props) {

  const monsterDetails = props.monsterDetails || {};
  console.log(monsterDetails);

  const abilityMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    if (mod >= 0) {
      return "+" + mod;
    } else if (mod === 0) {
      return "±" + mod;
    }
    return mod;
  }

  const damageResistances = () => {
    let result = []

    if (monsterDetails.damage_vulnerabilities && monsterDetails.damage_vulnerabilities.length > 0) {
      result.push(<li><label>ダメージ脆弱性：</label>{monsterDetails.damage_vulnerabilities.join(', ')}</li>);
    }

    if (monsterDetails.damage_resistances && monsterDetails.damage_resistances.length > 0) {
      result.push(<li><label>ダメージ抵抗：</label>{monsterDetails.damage_resistances.join(', ')}</li>);
    }

    if (monsterDetails.damage_immunities && monsterDetails.damage_immunities.length > 0) {
      result.push(<li><label>ダメージ完全耐性：</label>{monsterDetails.damage_immunities.join(', ')}</li>);
    }

    if (monsterDetails.condition_immunities && monsterDetails.condition_immunities.length > 0) {
      result.push(<li><label>状態完全耐性：</label>{monsterDetails.condition_immunities.map(ci => ci.name).join(', ')}</li>);
    }

    return result
  }

  const parseStrings = (str) => {
    if (!str) return null;
    return str.split('\n').map((line, idx) => {
      const sepIndex = line.indexOf('：');
      if (sepIndex !== -1) {
        const label = line.slice(0, sepIndex + 1);
        const value = line.slice(sepIndex + 1);
        return (
          <div key={idx}>
            <label>{label}</label>{value}
          </div>
        );
      } else {
        return <div key={idx}>{line}</div>;
      }
    });
  }

  const note = () => {
    if (monsterDetails.legendary_actions && monsterDetails.legendary_actions.length > 0) {
      return (
        <div className="StatBlockBody Right">
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

  if (!monsterDetails.name) {
    return <div className="StatBlock">リストから選択してください。</div>;
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
          <li><label>hp:</label>{monsterDetails.hit_points} {"（" + monsterDetails.hit_dice + "）"}</li>
          <li><label>移動速度:</label>{Object.entries(monsterDetails.speed).map(([key, value]) => `${key === 'walk' ? '' : key + ' '}${value} `).join(', ')}</li>
        </div>

        <hr></hr>

        <div className="StatBlockAbilitys">
          <li><label>【筋】</label><br></br>{monsterDetails.strength} {"(" + abilityMod(monsterDetails.strength) + ")"}</li>
          <li><label>【敏】</label><br></br>{monsterDetails.dexterity} {"(" + abilityMod(monsterDetails.dexterity) + ")"}</li>
          <li><label>【耐】</label><br></br>{monsterDetails.constitution} {"(" + abilityMod(monsterDetails.constitution) + ")"}</li>
          <li><label>【知】</label><br></br>{monsterDetails.intelligence} {"(" + abilityMod(monsterDetails.intelligence) + ")"}</li>
          <li><label>【判】</label><br></br>{monsterDetails.wisdom} {"(" + abilityMod(monsterDetails.wisdom) + ")"}</li>
          <li><label>【魅】</label><br></br>{monsterDetails.charisma} {"(" + abilityMod(monsterDetails.charisma) + ")"}</li>
        </div>

        <hr></hr>

        <div className="StatBlockSpecs">
          <li><label>技能:</label>{monsterDetails.proficiencies ? monsterDetails.proficiencies.map(p => p.proficiency.name + ' +' + p.value).join(', ') : '-'}</li>
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
        <hr></hr>

        <div className="StatBlockSpecs">
          {monsterDetails.actions ? monsterDetails.actions.map((action, idx) => (
            <p key={idx}>
              <strong>{action.name}:</strong> {action.desc}
            </p>
          )) : null}
        </div>

      </div>
      {note()}


    </div>
  );
}

export default StatBlock;
