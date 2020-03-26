import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './userhub.style.jana.css';
import './userhub.style.janb.css';
import midi5pin from '../img/midi5pin.svg';
import home from '../img/home.svg';

const midiConfigurations = [
    {
        uuid: 'a26e975c-4d0a-4bc8-9064-0b29126423b5',
        name: 'default'
    },
    {
        uuid: '4870866b-fcde-4510-b305-ba456b050280',
        name: 'volca setup'
    },
    {
        uuid: 'fedf4790-c908-4baf-b21b-09920034c5e2',
        name: 'live rig'
    },
    {
        uuid: '59e7b5ff-ab8d-4766-804a-72c31f06821d',
        name: 'studio rig'
    },
    {
        uuid: '496b2a79-d6cf-4501-a964-1b484a6d2c02',
        name: 'tasty chips gr-1 centric'
    },
    {
        uuid: '161277f7-6ebe-45b1-bafc-2c0a8b0ae7d6',
        name: 'space and thyme'
    }
];

function Home() {
    
    const [homeMonth, setHomeMonth] = useState('_JanuaryB');
    const [userClockResolution, setUserClockResolution] = useState(480);
    
    const clockResolutionChange = (val) => {
        setUserClockResolution(val);
    }
    
        return(
            <div className={'homeContainer' + homeMonth}>
                <img className={'homeIcon' + homeMonth}
                    src={home}></img>
                
                <div className={'homeBulletList' + homeMonth}>
                    <img className={'homeMidiBullet' + homeMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + homeMonth}>MIDI manager:</p>
                    <select className={'homeDropdown' + homeMonth}>
                        {midiConfigurations.map(item => 
                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                        )}
                    </select>
                    <button className={'homeButtons' + homeMonth}>load</button>
                    <button className={'homeButtons' + homeMonth}>edit</button>
                </div>
                <div className={'homeBulletList' + homeMonth}>
                    <img className={'homeMidiBullet' + homeMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + homeMonth}>clock resolution:</p>
                    <input className={'homeDropdown' + homeMonth}
                        max={'510510'}
                        min={'1'}
                        onChange={(e) => clockResolutionChange(e.target.value)}
                        type='number' 
                        value={userClockResolution}></input>
                </div>
            </div>
        );
    
}

export default Home;