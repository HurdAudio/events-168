import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './userhub.style.jana.css';
import midi5pin from '../img/midi5pin.svg';
import dna from '../img/dna.svg';

const sequenceProjects = [
    {
        uuid: '2c69850b-549e-4420-90e0-d8ac39c89dd8',
        name: 'new project'
    },
    {
        uuid: 'a4dc3221-b2fa-4d52-bae6-9c85bf55d63c',
        name: 'drone in 13-limit'
    }
]

function Sequencer() {
    
    const [sequenceMonth, setSequenceMonth] = useState('_JanuaryA');
    
        return(
            <div className={'homeContainer' + sequenceMonth}>
                <img className={'dnaIcon' + sequenceMonth}
                    src={dna}></img>
                
                <div className={'homeBulletList' + sequenceMonth}>
                    <img className={'homeMidiBullet' + sequenceMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + sequenceMonth}>projects:</p>
                    <select className={'homeDropdown' + sequenceMonth}>
                        {sequenceProjects.map(item => 
                            <option value={item.uuid}>{item.name}</option>
                        )}
                    </select>
                    <button className={'homeButtons' + sequenceMonth}>step edit</button>
                    <button className={'homeButtons' + sequenceMonth}>playback</button>
                    <button className={'homeButtons' + sequenceMonth}>recorder</button>
                </div>
                
                <div className={'homeBulletList' + sequenceMonth}>
                    <img className={'homeMidiBullet' + sequenceMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + sequenceMonth}>sequence manager:</p>
                    
                    <button className={'homeButtons' + sequenceMonth}>manager</button>
                </div>
                
                <div className={'homeBulletList' + sequenceMonth}>
                    <img className={'homeMidiBullet' + sequenceMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + sequenceMonth}>shared sequences:</p>
                    
                    <button className={'homeButtons' + sequenceMonth}>sequence market</button>
                </div>
                
                
            </div>
        );
    
}

export default Sequencer;